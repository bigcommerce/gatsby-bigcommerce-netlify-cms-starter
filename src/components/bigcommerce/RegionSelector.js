import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { navigate, graphql, StaticQuery } from 'gatsby'
import CartContext from '../../context/CartProvider'
import parseChannelRegionInfo from '../../helpers/channels'
import _ from 'lodash'
import ReactFlagsSelect from 'react-flags-select'
import 'react-flags-select/css/react-flags-select.css'
import './RegionSelector.css'

const RegionSelector = ({data, count, pageContext}) => {
  const value = useContext(CartContext)
  const { updateCartChannel } = value || { updateCartChannel: () => { console.log('empty updateCartChannel function') }}
  const channels = data.allBigCommerceChannels.nodes
  const basePagePath = pageContext.basePath || ''
  const { channelRegionCountryCode } = parseChannelRegionInfo(pageContext.channel)

  const findChannelByCountryCode = (countryCode, channels) => {
    // Set to first channel initially so we have a fallback if no match is found
    let matchedChannel = channels[0]

    for (var i = channels.length - 1; i >= 0; i--) {
      const { channelRegionCountryCode } = parseChannelRegionInfo(channels[i])

      if (channelRegionCountryCode === countryCode) {
        matchedChannel = channels[i]
        break
      }
    }

    return matchedChannel
  }

  const onSelectFlag = (channels, basePagePath, selectedCountryCode) => {
    const selectedChannel = findChannelByCountryCode(selectedCountryCode, channels)
    const { channelRegionLocale, channelRegionPathPrefix, channelRegionCurrency } = parseChannelRegionInfo(selectedChannel)

    navigate(`${channelRegionPathPrefix}/${basePagePath}`)

    updateCartChannel(selectedChannel.bigcommerce_id, channelRegionCurrency, channelRegionLocale, channelRegionPathPrefix)
  }

  const countries = _.compact(channels.map(channel => {
    const { channelRegionCountryCode } = parseChannelRegionInfo(channel)
    return channelRegionCountryCode
  }))

  const countryLabels = channels.map(channel => {
    const { channelRegionName, channelRegionCountryCode } = parseChannelRegionInfo(channel)
    return { [channelRegionCountryCode] : channelRegionName }
  })

  return (
    <ReactFlagsSelect
      defaultCountry={channelRegionCountryCode}
      countries={countries}
      customLabels={{...countryLabels}}
      onSelect={onSelectFlag.bind(this, channels, basePagePath)} />
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
    render={(data, count) => <RegionSelector data={data} count={count} pageContext={pageContext.pageContext} />}
  />
)
