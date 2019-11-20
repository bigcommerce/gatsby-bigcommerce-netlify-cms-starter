import React from 'react'
import PropTypes from 'prop-types'
import { navigate, graphql, StaticQuery } from 'gatsby'
import _ from 'lodash'
import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/css/react-flags-select.css';
import './RegionSelector.css';

// const channelRegionNameIdx = 0
const channelRegionLocaleIdx = 1
const channelRegionPathIdx = 2
// const channelRegionCurrencyIdx = 3


class RegionSelector extends React.Component {
  findChannelByCountryCode(countryCode, channels) {
    // Set to first channel initially so we have a fallback if no match is found
    let matchedChannel = channels[0]

    for (var i = channels.length - 1; i >= 0; i--) {
      // eslint-disable-next-line
      const regionLocaleCode = channels[i].external_id.split('|')[channelRegionLocaleIdx]

      if (regionLocaleCode === countryCode) {
        matchedChannel = channels[i]
        break
      }
    }

    return matchedChannel
  }

  onSelectFlag(channels, baseProductPath, selectedCountryCode) {
    const selectedPathPrefix = this.findChannelByCountryCode(selectedCountryCode, channels).external_id.split('|')[channelRegionPathIdx]

    navigate(`${selectedPathPrefix}/${baseProductPath}`)
  }

  render() {
    const { data, pageContext } = this.props
    const { nodes: channels } = data.allBigCommerceChannels
    const baseProductPath = pageContext.pageContext.baseProductPath
    const currentChannelCountryCode = pageContext.pageContext.channel.external_id.split('|')[channelRegionLocaleIdx]

    const countries = _.compact(channels.map(channel => {
      // eslint-disable-next-line
      const [ regionName, regionLocaleCode ] = channel.external_id.split('|')
        return regionLocaleCode
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
        onSelect={this.onSelectFlag.bind(this, channels, baseProductPath)} />
    )
  }
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
        allBigCommerceChannels {
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
