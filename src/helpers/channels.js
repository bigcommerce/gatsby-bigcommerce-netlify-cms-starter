const channelRegionNameIdx = 0
const channelRegionLocaleIdx = 1
const channelRegionPathIdx = 2
const channelRegionCurrencyIdx = 3

const parseChannelRegionInfo = (channel) => {
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

export default parseChannelRegionInfo
