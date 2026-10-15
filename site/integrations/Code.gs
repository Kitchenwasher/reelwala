// Google Apps Script intake. Deploy as the owner, with web app access for Anyone.
// The spreadsheet and uploaded portfolio files remain private to the owner.
const SPREADSHEET_ID = '1FJgAmUw1CxSokhUSJxPsbE_gmXqvm7t1eesWt4a1qr4';
const MODELS = ['iPhone 15','iPhone 15 Plus','iPhone 15 Pro','iPhone 15 Pro Max','iPhone 16','iPhone 16 Plus','iPhone 16 Pro','iPhone 16 Pro Max','iPhone 16e','iPhone 17','iPhone 17 Pro','iPhone 17 Pro Max','iPhone Air','iPhone 17e','iPhone 18 Pro','iPhone 18 Pro Max'];
function doGet() {return output_({success:true,service:'Reel Wala intake',version:1});}
function doPost(event) {
  let lock, folder, saved=false;
  try {
    if(!event || !event.postData || event.postData.length>36000000) throw new Error('The submission is too large.');
    const body=JSON.parse(event.postData.contents);
    if(body.website) throw new Error('Unable to accept this submission.');
    if(!['booking','creator'].includes(body.kind))throw new Error('Unknown submission type.');
    if(!/^[0-9a-f-]{36}$/i.test(body.submissionId||''))throw new Error('Missing submission ID.');
    const data=body.data||{};
    required_(data,'name',100);required_(data,'email',254);required_(data,'phone',20);required_(data,'locality',150);
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))throw new Error('Enter a valid email.');
    if(!/^[+0-9()\s-]{7,20}$/.test(data.phone))throw new Error('Enter a valid phone number.');
    if(body.kind==='booking'){
      if(!['Wedding / private celebration','Corporate event','Social / cultural event','Something else'].includes(data.occasion))throw new Error('Select an occasion.');
      if(!/^\d{4}-\d{2}-\d{2}$/.test(data.date||''))throw new Error('Choose an event date.');
      const date=new Date(data.date+'T00:00:00+05:30');
      if(isNaN(date.getTime())||data.date<Utilities.formatDate(new Date(),'Asia/Kolkata','yyyy-MM-dd'))throw new Error('Choose a current or future event date.');
      if(!['Help me choose','Standard','Extended','Custom / Premium'].includes(data.package))throw new Error('Select a package.');
      if(String(data.notes||'').length>2000)throw new Error('Please shorten your notes.');
      if((body.uploads||[]).length)throw new Error('Booking enquiries do not accept files.');
    } else {
      if(!MODELS.includes(data.device))throw new Error('Select a supported iPhone.');
      if(data.portfolio&&!/^https?:\/\//i.test(data.portfolio))throw new Error('Enter a valid portfolio link.');
    }
    const uploads=body.uploads||[];
    const photos=uploads.filter(file=>file.kind==='photo');const videos=uploads.filter(file=>file.kind==='video');
    if(body.kind==='creator'&&(photos.length!==5||videos.length>2||photos.length+videos.length!==uploads.length))throw new Error('Choose five photos and up to two optional videos.');
    const decoded=[];let totalBytes=0;
    for(const file of uploads){
      const allowed=file.kind==='photo'?['image/jpeg','image/png','image/webp','image/heic','image/heif']:['video/mp4','video/quicktime','video/webm'];
      if(!allowed.includes(file.mime)||typeof file.data!=='string')throw new Error('Unsupported portfolio file type.');
      const bytes=Utilities.base64Decode(file.data);const limit=file.kind==='photo'?4000000:10000000;
      if(bytes.length>limit||bytes.length===0)throw new Error('Photos must be under 4 MB and videos under 10 MB.');
      totalBytes+=bytes.length;if(totalBytes>25000000)throw new Error('Keep all portfolio files under 25 MB combined.');
      decoded.push({file,bytes});
    }
    lock=LockService.getScriptLock();if(!lock.tryLock(20000))throw new Error('The team is receiving another request. Please try again shortly.');
    const book=SpreadsheetApp.openById(SPREADSHEET_ID);const sheet=book.getSheetByName(body.kind==='booking'?'Bookings':'Creators');
    if(!sheet)throw new Error('The intake sheet is unavailable.');
    const last=sheet.getLastRow();
    if(last>=2&&sheet.getRange(2,1,last-1,1).createTextFinder(body.submissionId).matchEntireCell(true).findNext())return output_({success:true,submissionId:body.submissionId,duplicate:true});
    const cache=CacheService.getScriptCache();
    const key='intake_'+Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,String(data.email).toLowerCase()));
    const recent=Number(cache.get(key)||0);if(recent>=3)throw new Error('You have already sent a few requests. Please try again in 10 minutes.');
    const urls={photo:[],video:[]};
    if(decoded.length){
      folder=DriveApp.createFolder('Reel Wala portfolio '+body.submissionId);
      for(const {file,bytes} of decoded){const name=String(file.name||'portfolio').replace(/[^a-zA-Z0-9._ -]/g,'_').slice(0,100);const created=folder.createFile(Utilities.newBlob(bytes,file.mime,name));urls[file.kind].push(created.getUrl());}
    }
    const common=[body.submissionId,new Date(),cell_(data.name),cell_(data.email),cell_(data.phone)];
    const row=body.kind==='booking'?[...common,cell_(data.occasion),new Date(data.date+'T12:00:00+05:30'),cell_(data.locality),cell_(data.package),cell_(data.notes),'New']:[...common,cell_(data.locality),cell_(data.device),cell_(data.portfolio),urls.photo.join('\n'),urls.video.join('\n'),'New'];
    sheet.appendRow(row);saved=true;cache.put(key,String(recent+1),600);
    return output_({success:true,submissionId:body.submissionId});
  }catch(error){
    if(folder&&!saved){try{folder.setTrashed(true);}catch(cleanupError){console.error('Portfolio cleanup requires attention.');}}
    return output_({success:false,error:String(error.message||'Unable to save your request.').slice(0,200)});
  }finally{if(lock)lock.releaseLock();}
}
function required_(data,key,max){if(typeof data[key]!=='string'||!data[key].trim()||data[key].length>max)throw new Error('Please check '+key+'.');data[key]=data[key].trim();}
function cell_(value){const text=String(value||'');return /^[=+\-@\t\r]/.test(text)?"'"+text:text;}
function output_(value){return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);}
