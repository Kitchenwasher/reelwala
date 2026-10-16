// Written service requirements; unprovided base/Premium rates stay on enquiry.
export const PACKAGE_PLANS = [
  {
    "id": "essential",
    "family": "standard",
    "name": "Standard",
    "subtitle": "Hourly Plan",
    "price": 1999,
    "bookingPackage": "Standard",
    "description": "Quick, focused content for when you need a high-quality reel without the wait.",
    "features": [
      "Up to 1 hour shoot time",
      "1 edited reel delivered (up to 60s)",
      "4 complimentary colour-graded photos",
      "Trained and certified reel maker",
      "Shot on latest iPhones",
      "Reel delivery within 24 hours"
    ]
  },
  {
    "id": "extended",
    "family": "standard",
    "name": "Extended",
    "subtitle": "Half Day Plan",
    "price": 4999,
    "bookingPackage": "Extended",
    "featured": true,
    "description": "Ideal for longer shoots, events, and creating multiple high-quality reels in one session.",
    "features": [
      "Up to 4 hours of shoot time",
      "2 edited reels delivered (up to 60s each)",
      "7 complimentary colour-graded photos",
      "Raw footage access",
      "Trained and certified reel maker",
      "Shot on latest iPhones",
      "Reel delivery within 24 hours"
    ]
  },
  {
    "id": "extra-hour",
    "family": "standard",
    "name": "Extra hour",
    "subtitle": "Add-on Coverage",
    "price": 1000,
    "addon": true,
    "bookingPackage": "Custom / Premium",
    "description": "Extend your shoot with an additional hour of coverage.",
    "features": [
      "₹1,000 per extra shoot hour",
      "1 extra reel OR 1 hour extra shoot",
      "Added to your agreed shoot coverage",
      "Confirm extra time with the team"
    ]
  },
  {
    "id": "premium-1",
    "family": "select",
    "name": "Premium option 1",
    "price": null,
    "pending": true,
    "bookingPackage": "Custom / Premium",
    "description": "Premium package details are available on enquiry.",
    "features": [
      "Coverage: to be confirmed",
      "Deliverables: to be confirmed",
      "Price: on enquiry"
    ]
  },
  {
    "id": "premium-2",
    "family": "select",
    "name": "Premium option 2",
    "price": null,
    "pending": true,
    "bookingPackage": "Custom / Premium",
    "description": "Premium package details are available on enquiry.",
    "features": [
      "Coverage: to be confirmed",
      "Deliverables: to be confirmed",
      "Price: on enquiry"
    ]
  },
  {
    "id": "premium-3",
    "family": "select",
    "name": "Premium option 3",
    "price": null,
    "pending": true,
    "bookingPackage": "Custom / Premium",
    "description": "Premium package details are available on enquiry.",
    "features": [
      "Coverage: to be confirmed",
      "Deliverables: to be confirmed",
      "Price: on enquiry"
    ]
  },
  {
    "id": "premium-4",
    "family": "select",
    "name": "Premium option 4",
    "price": null,
    "pending": true,
    "bookingPackage": "Custom / Premium",
    "description": "Premium package details are available on enquiry.",
    "features": [
      "Coverage: to be confirmed",
      "Deliverables: to be confirmed",
      "Price: on enquiry"
    ]
  }
];
export const formatRupees=value=>typeof value==='number'&&Number.isFinite(value)?`₹${Math.round(value).toLocaleString('en-IN')}`:'On enquiry';
export function priceAtTime(target,elapsed,duration=1250){
  if(typeof target!=='number'||!Number.isFinite(target))return null;
  const progress=Math.max(0,Math.min(1,elapsed/duration));
  return Math.round(target*(1-(1-progress)**3));
}
