import fs from 'node:fs/promises';
import { Workbook, SpreadsheetFile } from '@oai/artifact-tool';
const workbook=Workbook.create();
const definitions={Bookings:['Submission ID','Submitted at','Name','Email','Phone','Occasion','Event date','Locality','Package','Notes','Status'],Creators:['Submission ID','Submitted at','Name','Email','Phone','Locality','iPhone model','Portfolio URL','Photo links','Video links','Status']};
for(const [name,headers] of Object.entries(definitions)){
  const sheet=workbook.worksheets.add(name);
  sheet.getRange('A1:K1').values=[headers];
  sheet.getRange('A1:K1').format={fill:'#EEEEEE',font:{name:'Arial',size:10,bold:true,color:'#171815'},rowHeight:30,verticalAlignment:'center',wrapText:true};
  sheet.getRange('A1:K10').format.columnWidth=21;
  sheet.getRange('D1:D10').format.columnWidth=29;
  sheet.getRange('J1:J10').format.columnWidth=34;
  sheet.freezePanes.freezeRows(1);
}
workbook.recalculate();
console.log((await workbook.inspect({kind:'sheet',include:'id,name',maxChars:1000})).ndjson);
for(const name of Object.keys(definitions)){
  const image=await workbook.render({sheetName:name,range:'A1:K4',scale:1,format:'png'});
  await fs.writeFile(new URL(`./output/${name}.png`,import.meta.url),new Uint8Array(await image.arrayBuffer()));
}
await (await SpreadsheetFile.exportXlsx(workbook)).save(new URL('./output/reel-wala-enquiries.xlsx',import.meta.url).pathname.replace(/^\/([A-Z]:)/,'$1'));
