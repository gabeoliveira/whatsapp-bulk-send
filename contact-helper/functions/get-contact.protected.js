

exports.handler = async function(context, event, callback) {
  const client = context.getTwilioClient();

  const phone = event.phone.split(':')[1];
  const { originalMessageSid } = event;

  try{
    
    let contact = await client.sync
    .services(context.SYNC_SERVICE_SID)
    .syncMaps(context.SYNC_MAP_SID)
    .syncMapItems(`${phone}_${originalMessageSid}`)
    .fetch()
    .then(result => {
      console.log(result.data);
      return {
        ...result.data,
        phone: phone,
        found: true
      }
    })
    .catch(err => {
      if (err.code === 20404) {
        return callback(null,{found:false})
      } else {
        console.error(err)
        callback(err)
      }
    })

    callback(null, contact)
    


  }

  catch(err){

    console.error(err);
    callback(null, {error: err})
  }

  
}
