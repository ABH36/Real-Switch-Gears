// Single source of truth for the WhatsApp number — every WhatsApp link on the
// site (floating button, contact page, per-product enquiry links) is built
// from this one value, so changing a number only ever means editing this file.
const WHATSAPP_NUMBER = "919373321989";

// Single source of truth for the site's own deployed domain — used to build
// absolute URLs in the sitemap, robots.txt, canonical/OpenGraph metadata, and
// per-product structured data (JSON-LD). Point this at whichever host is
// currently live (production domain, or a staging host like easypanel) and
// every one of those updates together. No trailing slash.
const SITE_URL = "https://real-switch-gear-real-switch-frontend.qbol3h.easypanel.host";

export const site = {
  url: SITE_URL,
  name: "Real Switchgears & Cables Pvt. Ltd.",
  shortName: "Real Switchgears",
  phone: "020 - 27110960",
  phone2: "020 - 27110960",
  phoneHref: "tel:02027110960",
  whatsappNumber: WHATSAPP_NUMBER,
  whatsapp: `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent("Hi, I would like to enquire about your products.")}`,
  email: "sales@realswitchgears.com",
  address:
    "Shop No. 6, Plot No. BG-74A, Jay Tulja Bhavani Complex, Telco Road, MIDC, Bhosari, Pune - 411 026, Maharashtra.",
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d30246.92033936081!2d73.836365!3d18.625139!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b87ea67a3701%3A0x6523a8914a5a51e3!2sReal%20Switchgears%20%26%20Cables%20Pvt.%20Ltd!5e0!3m2!1sen!2sin!4v1724917865858!5m2!1sen!2sin",
  yearsExperience: "25+",
  established: 2000,

  phone2: "020 - 27110930",
  phone2Href: "tel:02027110930",
  email2: "acreliance@gmail.com",
  hours: "Monday to Friday : 9.00am to 07.00pm",
  hoursClosed: "Sunday : Closed",
};


