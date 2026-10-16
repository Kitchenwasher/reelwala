// Written service requirements; unprovided base/Premium rates stay on enquiry.
export const PACKAGE_PLANS = [
  {
    "id": "essential",
    "family": "standard",
    "name": "Standard",
    "price": null,
    "bookingPackage": "Standard",
    "description": "Quick, focused content for a high-quality reel without the wait.",
    "features": [
      "4 complimentary colour-graded photos",
      "Reel delivery within 24 hours",
      "A professional reeler assigned to your event"
    ]
  },
  {
    "id": "extended",
    "family": "standard",
    "name": "Extended",
    "price": null,
    "bookingPackage": "Extended",
    "featured": true,
    "description": "For longer shoots, events and creating multiple high-quality reels in one session.",
    "features": [
      "Up to 4 hours of shoot time",
      "7 complimentary colour-graded photos",
      "Reel delivery within 24 hours"
    ]
  },
  {
    "id": "extra-hour",
    "family": "standard",
    "name": "Extra hour",
    "price": 1000,
    "addon": true,
    "bookingPackage": "Custom / Premium",
    "description": "Extend your shoot with an additional hour of coverage.",
    "features": [
      "₹1,000 per extra shoot hour",
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
