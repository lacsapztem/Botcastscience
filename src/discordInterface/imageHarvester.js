const ChannelList = [];

var NewImageCallback = () => { return null };

const registerNewImageCallback = (func) => {
  NewImageCallback = func;
};


const parseMessageList = (messages) => {
  //assume that every message are coming from the same channel
  const tab = [];
  var channelId=null
  //Iterate through the messages here with the variable "messages".
  messages.forEach((m) => {
    tab.push(m);
    channelId=m.channelId
  });
  tab.toReversed().forEach(getImageAttachment);
  console.log(`Received ${messages.size} messages in channel ${channelId}`);
  console.log(`found ${ChannelList[channelId].ImageList.length} file(s)`);
};



const getImageAttachment = (message) => {
  message.attachments.forEach((file) => {
    if (file.contentType && file.contentType.startsWith('image/')) ChannelList[message.channelId].ImageList.push(file);
  });
  const nbImg=ChannelList[message.channelId].ImageList.length;
  setCurrentCursor(message.channelId, nbImg-1);
  NewImageCallback()
}


const filterAttachementMsg = (message) => message.attachments.size > 0;


const initChannel = (channel) => {
  //console.log(channel);
  channel.messages.fetch({ limit: 100 }).then(parseMessageList);
  ChannelList[channel.id]={
    ImageList : [],
    Collector : channel.createMessageCollector({ filterAttachementMsg, Max: 1 }),
    cursor: 0,
  }
  ChannelList[channel.id].Collector.on('collect', getImageAttachment);
  ChannelList[channel.id].Collector.on('end', (collected) => {
    console.log(`End of initial message collector`)
    delete ChannelList[channel.id];
    NewImageCallback();
  });
};

const getCurrentCursor = (ChannelId) => {
  if(ChannelList[ChannelId]) {
    return ChannelList[ChannelId].cursor;
  } else {
    return 0;
  } 
}


const setCurrentCursor = (ChannelId,value) => {
  console.log('ChannelId',ChannelId)
  console.log('value',value)
  console.log('ChannelList',ChannelList)
  console.log('ChannelList[ChannelId]',ChannelList[ChannelId])
  return ChannelList[ChannelId].cursor= value;
}


const countAttachment = (ChannelId) => {
  if(ChannelList[ChannelId]) {
    console.log(`There is ${ChannelList[ChannelId].ImageList.length} file(s)`);
    setTimeout(countAttachment(ChannelId), 10000);
  }
};

const getImageList = (ChannelId) => {
  if(ChannelList[ChannelId]) {
    return ChannelList[ChannelId].ImageList;
  } else {
    return []
  }
  
}

const launchImageScanner = (ChannelId,client) => {
  if(!ChannelList[ChannelId]) {
    client.channels.fetch(ChannelId)
      .then(initChannel)
      .catch(console.error);
  }
};

const stopImageScanner = (ChannelId,client) => {
  if(ChannelList[ChannelId]) {
    ChannelList[ChannelId].Collector.stop();
  } 
};

const imageHarvester = {
  countAttachment,
  getImageList,
  launchImageScanner,
  stopImageScanner,
  registerNewImageCallback,
  setCurrentCursor,
  getCurrentCursor,
};


export default imageHarvester;
