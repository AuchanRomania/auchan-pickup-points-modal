import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import {
  getCurrentPosition,
  handleGetAddressByGeolocation,
} from '../utils/CurrentPosition'
import { searchPickupAddressByGeolocationEvent } from '../utils/metrics'

import UserGeolocation from '../components/UserGeolocation'
import GeolocationPin from '../assets/components/GeolocationPin'
import WaitingPin from '../assets/components/WaitingPin'
import SearchingPin from '../assets/components/SearchingPin'

import AddressShapeWithValidation from '@vtex/address-form/lib/propTypes/AddressShapeWithValidation'

import './AskForGeolocation.css'

import { WAITING, SEARCHING, ASK, HTTPS } from '../constants'

export class AskForGeolocation extends Component {
  componentDidMount() {
    if (this.props.askForGeolocation) {
      this.handleGeolocationStatus(WAITING)
      if (window.location.protocol !== HTTPS) {
        this.getCurrentPositionSuccess({
          coords: {
            latitude: -22.9432587,
            longitude: -43.1862642,
          },
        })
        return
      }
      this.props.googleMaps &&
        getCurrentPosition(
          this.getCurrentPositionSuccess,
          this.getCurrentPositionError
        )
    }
  }

  getCurrentPositionSuccess = position => {
    handleGetAddressByGeolocation({
      newPosition: {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      },
      geocoder: this.geocoder,
      googleMaps: this.props.googleMaps,
      onChangeAddress: this.props.onChangeAddress,
      rules: this.props.rules,
      address: this.props.address,
    })
    this.handleGeolocationStatus(SEARCHING)
    searchPickupAddressByGeolocationEvent({
      searchedAddressByGeolocation: true,
      confirmedGeolocation: true,
    })
  }

  getCurrentPositionError = error => {
    switch (error.code) {
      case 0: // UNKNOWN ERROR
        this.props.onAskForGeolocation(false)
        searchPickupAddressByGeolocationEvent({
          confirmedGeolocation: true,
          browserError: true,
        })
        break
      case 1: // PERMISSION_DENIED
        this.props.onAskForGeolocation(false)
        searchPickupAddressByGeolocationEvent({
          deniedGeolocation: true,
        })
        break
      case 2: // POSITION_UNAVAILABLE
        this.props.onAskForGeolocation(false)
        searchPickupAddressByGeolocationEvent({
          confirmedGeolocation: true,
          positionUnavailable: true,
        })
        break
      case 3: // TIMEOUT
        this.props.onAskForGeolocation(false)
        searchPickupAddressByGeolocationEvent({
          dismissedGeolocation: true,
        })
        break
      default:
        return false
    }
  }

  handleGeolocationStatus = status => {
    this.props.onAskForGeolocationStatus(status)
  }

  handleManualGeolocation = () => {
    this.props.onAskForGeolocation(false)
  }

  translate = id =>
    this.props.intl.formatMessage({
      id: `pickupPointsModal.${id}`,
    })

  render() {
    const { status } = this.props

    return (
      <div className="pkpmodal-ask-for-geolocation">
        {status === ASK && (
          <div className="pkpmodal-ask-for-geolocation-wrapper pkpmodal-ask-for-geolocation-ask">
            <h2 className="pkpmodal-ask-for-geolocation-title">
              {this.translate('geolocationDiscover')}
            </h2>
            <h3 className="pkpmodal-ask-for-geolocation-subtitle">
              {this.translate('geolocationAsk')}
            </h3>
            <div className="pkpmodal-ask-for-geolocation-image-ask">
              <GeolocationPin />
            </div>
            <div className="pkpmodal-ask-for-geolocation-cta">
              <UserGeolocation
                address={this.props.address}
                pickupOptionGeolocations={this.props.pickupOptionGeolocations}
                googleMaps={this.props.googleMaps}
                onChangeAddress={this.props.onChangeAddress}
                onGetGeolocation={this.handleGeolocationStatus}
                handleAskForGeolocation={this.props.onAskForGeolocation}
                rules={this.props.rules}
              />
            </div>
            <div className="pkpmodal-ask-for-geolocation-manual">
              <button
                type="button"
                onClick={this.handleManualGeolocation}
                className="btn-pkpmodal-ask-for-geolocation-manual btn btn-link"
              >
                {this.translate('geolocationManual')}
              </button>
            </div>
          </div>
        )}

        {status === WAITING && (
          <div className="pkpmodal-ask-for-geolocation-wrapper pkpmodal-ask-for-geolocation-waiting">
            <div className="pkpmodal-ask-for-geolocation-image-waiting">
              <WaitingPin />
            </div>
            <div className="pkpmodal-ask-for-geolocation-image-waiting-shadow" />
            <div className="pkpmodal-ask-for-geolocation-instructions">
              <h2 className="pkpmodal-ask-for-geolocation-title-small">
                {this.translate('geolocationWaiting')}
              </h2>
              <h3 className="pkpmodal-ask-for-geolocation-subtitle">
                {this.translate('geolocationAllow')}
              </h3>
            </div>
          </div>
        )}

        {status === SEARCHING && (
          <div className="pkpmodal-ask-for-geolocation-wrapper pkpmodal-ask-for-geolocation-searching">
            <div className="pkpmodal-ask-for-geolocation-image-searching">
              <SearchingPin />
            </div>
            <div className="pkpmodal-ask-for-geolocation-image-searching-shadow" />
            <div className="pkpmodal-ask-for-geolocation-instructions">
              <h2 className="pkpmodal-ask-for-geolocation-title-small">
                {this.translate('geolocationSearching')}
              </h2>
            </div>
          </div>
        )}
      </div>
    )
  }
}

AskForGeolocation.propTypes = {
  address: AddressShapeWithValidation,
  askForGeolocation: PropTypes.bool.isRequired,
  googleMaps: PropTypes.object,
  intl: intlShape,
  onChangeAddress: PropTypes.func.isRequired,
  onAskForGeolocation: PropTypes.func.isRequired,
  onAskForGeolocationStatus: PropTypes.func.isRequired,
  pickupOptionGeolocations: PropTypes.array,
  rules: PropTypes.object,
  status: PropTypes.string.isRequired,
}

export default injectIntl(AskForGeolocation)