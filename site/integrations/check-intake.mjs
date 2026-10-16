import fs from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=await fs.readFile(new URL('./Code.gs',import.meta.url),'utf8');
let rows=[],duplicate=false;
const context=vm.createContext({console,ContentService:{createTextOutput:value=>({setMimeType:()=>JSON.parse(value)}),MimeType:{JSON:'json'}},LockService:{getScriptLock:()=>({tryLock:()=>true,releaseLock(){}})},SpreadsheetApp:{openById:()=>({getSheetByName:()=>({getLastRow:()=>rows.length+1,getRange:()=>({createTextFinder:()=>({matchEntireCell:()=>({findNext:()=>duplicate})})}),appendRow:row=>rows.push(row)})})},CacheService:{getScriptCache:()=>({get:()=>null,put(){}})},Utilities:{formatDate:()=> '2026-10-15',base64EncodeWebSafe:()=> 'hashed',computeDigest:()=>[],DigestAlgorithm:{SHA_256:'sha'}}});
vm.runInContext(source,context);
const valid={kind:'booking',submissionId:'12345678-1234-1234-1234-123456789012',data:{name:'Sample Visitor',email:'sample@example.com',phone:'+91 90000 00000',locality:'Viman Nagar',occasion:'Wedding / private celebration',date:'2026-11-15',package:'Standard',notes:'=IMPORTXML("bad")'},uploads:[]};
const invoke=body=>context.doPost({postData:{length:JSON.stringify(body).length,contents:JSON.stringify(body)}});
assert.equal(invoke({...valid,website:'spam.example'}).success,false);
assert.equal(invoke({...valid,data:{...valid.data,email:'bad'}}).success,false);
assert.equal(invoke({...valid,data:{...valid.data,date:'2020-01-01'}}).success,false);
assert.equal(invoke({...valid,data:{...valid.data,package:'Invalid'}}).success,false);
assert.equal(invoke({...valid,kind:'creator',data:{...valid.data,device:'iPhone 16'}}).success,false);
assert.equal(invoke(valid).success,true);assert.equal(rows.length,1);
assert.equal(rows[0][9].startsWith("'="),true);
duplicate=true;assert.equal(invoke(valid).duplicate,true);assert.equal(rows.length,1);
assert.equal(context.doPost({postData:{length:36000001,contents:'{}'}}).success,false);
console.log('Intake checks passed: validation, file counts, formula escaping, duplicate handling, payload limit.');

// Editing accepts three or four video clips without an event date or locality.
duplicate=false;rows=[];
Object.assign(context.Utilities,{
  base64Decode:value=>Array.from(Buffer.from(value,'base64')),
  newBlob:(bytes,mime,name)=>({bytes,mime,name})
});
context.DriveApp={createFolder:()=>({createFile:blob=>({getUrl:()=> 'https://drive.google.com/file/'+blob.name}),setTrashed(){}})};
const clip={kind:'video',name:'clip.mp4',mime:'video/mp4',data:Buffer.from('sample video').toString('base64')};
const edit={...valid,kind:'edit',data:{name:'Editor Client',email:'edit@example.com',phone:'+91 90000 00000',notes:'=brief'},uploads:[clip,clip,{...clip,name:'third.mp4'}]};
assert.equal(invoke({...edit,uploads:[clip,clip]}).success,false);
assert.equal(invoke({...edit,uploads:Array(5).fill(clip)}).success,false);
assert.equal(invoke({...edit,uploads:[clip,clip,{...clip,mime:'image/jpeg'}]}).success,false);
assert.equal(invoke({...edit,uploads:[clip,clip,{...clip,data:''}]}).success,false);
assert.equal(invoke({...edit,data:{...edit.data,notes:'x'.repeat(2001)}}).success,false);
assert.equal(invoke(edit).success,true);assert.equal(rows.length,1);
assert.equal(rows[0][5].split('\n').length,3);assert.equal(rows[0][6],"'=brief");
assert.equal(invoke({...edit,uploads:[...edit.uploads,{...clip,name:'fourth.mp4'}]}).success,true);
assert.equal(rows[1][5].split('\n').length,4);
console.log('Editing intake checks passed: clip counts, types, empty files, brief limits, saved links and formula escaping.');

// The standalone creator page keeps the existing portfolio intake contract.
rows=[];
const photo={kind:'photo',name:'photo.jpg',mime:'image/jpeg',data:Buffer.from('sample photo').toString('base64')};
const creator={...valid,kind:'creator',data:{name:'Creator Applicant',email:'creator@example.com',phone:'+91 90000 00000',locality:'Pune',device:'iPhone 16',portfolio:'https://example.com/portfolio'},uploads:[...Array(5).fill(photo),clip]};
assert.equal(invoke({...creator,uploads:Array(4).fill(photo)}).success,false);
assert.equal(invoke({...creator,uploads:[...Array(5).fill(photo),clip,clip,clip]}).success,false);
assert.equal(invoke({...creator,data:{...creator.data,device:'Unsupported'}}).success,false);
assert.equal(invoke({...creator,data:{...creator.data,portfolio:'not-a-link'}}).success,false);
assert.equal(invoke({...creator,uploads:[...Array(4).fill(photo),{...photo,mime:'image/svg+xml'}]}).success,false);
for(const device of ['iPhone 15','iPhone 15 Plus','iPhone 15 Pro','iPhone 15 Pro Max']) assert.equal(invoke({...creator,data:{...creator.data,device}}).success,false);
assert.equal(invoke(creator).success,true);assert.equal(rows.length,1);
assert.equal(rows[0][5],'Pune');assert.equal(rows[0][6],'iPhone 16');
assert.equal(rows[0][8].split('\n').length,5);assert.equal(rows[0][9].split('\n').length,1);
console.log('Creator intake checks passed: required portfolio counts, device, URL, file types and private upload links.');
