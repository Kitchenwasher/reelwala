// Preview content approved for dummy pricing. Replace before offering fixed rates.
export const PACKAGE_PLANS = [
  {id:'essential',family:'standard',name:'Essential',price:1999,bookingPackage:'Standard',description:'A little coverage for a small occasion.',features:['Up to 1 hour of coverage','1 edited reel + 2 colour-graded photos','One creator for your event']},
  {id:'standard',family:'standard',name:'Standard',price:3499,bookingPackage:'Standard',featured:true,description:'The moments, the people, the atmosphere.',features:['Short event coverage with one creator','1 edited reel + 4 colour-graded photos','Edited reel delivery within 24 hours']},
  {id:'extended',family:'standard',name:'Extended',price:5999,bookingPackage:'Extended',description:'More time to capture the whole occasion.',features:['Up to 4 hours of coverage','2 edited reels + 7 colour-graded photos','Edited reel delivery within 24 hours']},
  {id:'single-event',family:'select',name:'Single event',price:9999,bookingPackage:'Custom / Premium',description:'One celebration, from arrival to the last dance.',features:['One event covered','3 edited reels + 10 colour-graded photos','A dedicated creator for your celebration']},
  {id:'two-events',family:'select',name:'Two events',price:18999,bookingPackage:'Custom / Premium',description:'Two chapters of the same celebration.',features:['Two events covered','6 edited reels + 20 colour-graded photos','Coverage planned around your schedule']},
  {id:'three-events',family:'select',name:'Three events',price:27999,bookingPackage:'Custom / Premium',featured:true,description:'For celebrations with more than one big moment.',features:['Three events covered','9 edited reels + 30 colour-graded photos','A coordinated creator schedule']},
  {id:'full-celebration',family:'select',name:'Full celebration',price:39999,bookingPackage:'Custom / Premium',description:'A complete story across your celebrations.',features:['Up to four events covered','12 edited reels + 40 colour-graded photos','A coverage plan built around your events']}
];
export const formatRupees=value=>`₹${Math.round(value).toLocaleString('en-IN')}`;
export function priceAtTime(target,elapsed,duration=1250){
  const progress=Math.max(0,Math.min(1,elapsed/duration));
  return Math.round(target*(1-(1-progress)**3));
}
