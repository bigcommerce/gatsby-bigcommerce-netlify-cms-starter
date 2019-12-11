const channelRegionNameIdx = 0
const channelRegionLocaleIdx = 1
const channelRegionPathIdx = 2
const channelRegionCurrencyIdx = 3

export const parseChannelRegionInfo = (channel) => {
  const channelSpec = channel.external_id.split('|')
  return {
    channelRegionName: channelSpec[channelRegionNameIdx],
    channelRegionLocale: channelSpec[channelRegionLocaleIdx],
    channelRegionCountryCode: channelSpec[channelRegionLocaleIdx].split('_')[1],
    channelRegionPathPrefix: (!channelSpec[channelRegionPathIdx].length) ? '' : '/' + channelSpec[channelRegionPathIdx],
    channelRegionCurrency: channelSpec[channelRegionCurrencyIdx],
    channelRegionHomeLink: '/' + channelSpec[channelRegionPathIdx],
  }
}

export const determineChannelViaWindowPath = (channels, rootChannel) => {
  for (var i = channels.length - 1; i >= 0; i--) {
    const { channelRegionPathPrefix } = parseChannelRegionInfo(channels[i])

    if (typeof window !== 'undefined' && channelRegionPathPrefix.length > 0 && window.location.pathname.match(`${channelRegionPathPrefix}/`) !== null) {
      return channels[i]
    }
  }

  return rootChannel
}

export const findChannelByCountryCode = (countryCode, channels) => {
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
