import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import styles from './CloseButton.css'

class CloseButton extends PureComponent {
  render() {
    const { onClickClose } = this.props

    return (
        <button
          className={`${styles.closeButton} pkpmodal-close`}
          onClick={onClickClose}
          type="button"
      >
        {/* Desktop SVG */}
        <svg
            className={styles.desktopIcon}
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
          <rect
              x="0.0341797"
              y="12.4351"
              width="17.8693"
              height="2"
              rx="1"
              transform="rotate(-45 0.0341797 12.4351)"
              fill="currentColor"
          />
          <rect
              x="1.41422"
              width="17.8693"
              height="2"
              rx="1"
              transform="rotate(45 1.41422 0)"
              fill="currentColor"
          />
        </svg>

        {/* Mobile SVG */}
        <svg
            className={styles.mobileIcon}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              d="M8.85355 6.10355C9.04882 5.90829 9.04882 5.59171 8.85355 5.39645C8.65829 5.20118 8.34171 5.20118 8.14645 5.39645L2.14645 11.3964C2.09851 11.4444 2.06234 11.4996 2.03794 11.5586C2.01575 11.6122 2.0033 11.6689 2.00057 11.726C2.00019 11.734 2 11.742 2 11.75C2 11.8178 2.01349 11.8824 2.03794 11.9414C2.06234 12.0004 2.09851 12.0556 2.14645 12.1036L8.14645 18.1036C8.34171 18.2988 8.65829 18.2988 8.85355 18.1036C9.04882 17.9083 9.04882 17.5917 8.85355 17.3964L3.70711 12.25L21.5 12.25C21.7761 12.25 22 12.0261 22 11.75C22 11.4739 21.7761 11.25 21.5 11.25L3.70711 11.25L8.85355 6.10355Z"
              fill="#02182B"
          />
        </svg>
      </button>
    )
  }
}

CloseButton.propTypes = {
  onClickClose: PropTypes.func.isRequired,
}

export default CloseButton
