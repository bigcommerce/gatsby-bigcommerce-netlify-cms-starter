import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { navigate, graphql, StaticQuery } from 'gatsby'
import CartContext from '../../context/CartProvider'
import _ from 'lodash'
import ReactFlagsSelect from 'react-flags-select'
import 'react-flags-select/css/react-flags-select.css'
import './RegionSelector.css'

// const channelRegionNameIdx = 0
const channelRegionLocaleIdx = 1
const channelRegionPathIdx = 2
const channelRegionCurrencyIdx = 3


const RegionSelector = ({data, count, pageContext}) => {
  const value = useContext(CartContext)
  const { updateCartChannel } = value || { updateCartChannel: () => { console.log('empty updateCartChannel function') }}

  const findChannelByCountryCode = (countryCode, channels) => {
    // Set to first channel initially so we have a fallback if no match is found
    let matchedChannel = channels[0]

    for (var i = channels.length - 1; i >= 0; i--) {
      const regionLocaleCode = channels[i].external_id.split('|')[channelRegionLocaleIdx]
      const regionCountryCode = regionLocaleCode.split('_')[1]

      if (regionCountryCode === countryCode) {
        matchedChannel = channels[i]
        break
      }
    }

    return matchedChannel
  }

  const onSelectFlag = (channels, basePath, selectedCountryCode) => {
    const selectedChannel = findChannelByCountryCode(selectedCountryCode, channels)
    const selectedLocale = selectedChannel.external_id.split('|')[channelRegionLocaleIdx]
    const selectedPathPrefix = selectedChannel.external_id.split('|')[channelRegionPathIdx]
    const selectedCurrency = selectedChannel.external_id.split('|')[channelRegionCurrencyIdx]

    navigate(`${selectedPathPrefix}/${basePath}`)

    updateCartChannel(selectedChannel.bigcommerce_id, selectedCurrency, selectedLocale, selectedPathPrefix)
  }

  const { nodes: channels } = data.allBigCommerceChannels
  const basePath = pageContext.pageContext.basePath || ''
  const currentChannelLocale = pageContext.pageContext.channel.external_id.split('|')[channelRegionLocaleIdx]
  const currentChannelCountryCode = currentChannelLocale.split('_')[1]

  const countries = _.compact(channels.map(channel => {
    return channel.external_id.split('|')[channelRegionLocaleIdx].split('_')[1]
  }))

  const countryLabels = channels.map(channel => {
    const [ regionName, regionLocaleCode ] = channel.external_id.split('|')
    return { [regionLocaleCode] : regionName }
  })

  return (
    <ReactFlagsSelect
      defaultCountry={currentChannelCountryCode}
      countries={countries}
      customLabels={{...countryLabels}}
      onSelect={onSelectFlag.bind(this, channels, basePath)} />
  )
}

RegionSelector.propTypes = {
  data: PropTypes.shape({
    allBigCommerceChannels: PropTypes.shape({
      nodes: PropTypes.array,
    }),
  }),
  pageContext: PropTypes.object,
}

export default (pageContext) => (
  <StaticQuery
    query={graphql`
      query ChannelQuery {
        allBigCommerceChannels(filter: {is_enabled: {eq: true}, platform: {eq: "custom"}, type: {eq: "storefront"}}) {
          nodes {
            id
            bigcommerce_id
            external_id
            name
          }
        }
      }
    `}
    render={(data, count) => <RegionSelector data={data} count={count} pageContext={pageContext} />}
  />
)
