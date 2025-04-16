import { faker } from "@faker-js/faker";

type MatcherEntry = [RegExp, () => string];

interface ContextBias {
  model_pattern: RegExp;
  matchers: MatcherEntry[];
}

export const contexts: ContextBias[] = [
  // User / Customer
  {
    model_pattern: /user|member|customer|profile|account|client/i,
    matchers: [
      [/\bfirst(_?name)?\b/i, faker.person.firstName],
      [/\bmiddle(_?name)?\b/i, faker.person.middleName],
      [/\blast(_?name)?\b/i, faker.person.lastName],
      [/\b(full_?)?name\b/i, faker.person.fullName],
      [/\bname\b/i, faker.person.fullName],
      [/\busername\b/i, faker.internet.username],
      [/\b(email(_?address)?)\b/i, faker.internet.email],
      [/\bavatar|photo|picture|image\b/i, faker.image.avatar],
      [
        /\b(phone|mobile|cell|telephone)(_?(number|no))?\b/i,
        () => faker.phone.number()
      ],
      [/\bgender\b/i, faker.person.sexType],
      [/\b(job|position|title)\b/i, faker.person.jobTitle],
      [/\bbio|about|description\b/i, faker.person.bio],
      [/\b(street|address)(_?(line|1))?\b/i, faker.location.streetAddress],
      [/\b(address_?line2|apt|suite|unit)\b/i, faker.location.secondaryAddress],
      [/\b(zip|postal)(_?code)?\b/i, faker.location.zipCode],
      [
        /\brole|permission\b/i,
        () => faker.helpers.arrayElement(["user", "admin", "super-admin"])
      ],
      [
        /\bstatus\b/i,
        () =>
          faker.helpers.arrayElement([
            "active",
            "inactive",
            "pending",
            "suspended"
          ])
      ],
      [
        /\b(dob|birth(day|date))\b/i,
        () => faker.date.birthdate().toISOString()
      ],
      [/\b(job|position|occupation|title|role)\b/i, faker.person.jobTitle],
      [/\b(company|employer|organization)\b/i, faker.company.name],
      [/\b(department|division|unit)\b/i, faker.commerce.department],
      [/\b(website|url|blog|portfolio)\b/i, faker.internet.url],
      [/\b(avatar|profile_?pic|image)\b/i, faker.image.avatar],
      [
        /\b(social|twitter|instagram|facebook|linkedin)\b/i,
        () => `@${faker.internet.username()}`
      ],
      [
        /\b(password|passphrase|pin)(_?hash)?\b/i,
        () => faker.internet.password()
      ],
      [
        /\b(locale|language)\b/i,
        () => faker.helpers.arrayElement(["en", "es", "fr", "de", "ja"])
      ],
      [/\btimezone\b/i, faker.location.timeZone],
      [
        /\bpreferences\b/i,
        () =>
          JSON.stringify({
            theme: faker.helpers.arrayElement(["light", "dark"])
          })
      ],
      [
        /\bverification_?status\b/i,
        () => faker.helpers.arrayElement(["verified", "unverified", "pending"])
      ]
    ]
  },

  // E-commerce
  {
    model_pattern:
      /product|item|inventory|good|cart|basket|merchandise|catalog/i,
    matchers: [
      [/\b(name|title)\b/i, faker.commerce.productName],
      [/\b(description|desc)\b/i, faker.commerce.productDescription],
      [/\b(price|amount|cost)\b/i, faker.finance.amount],
      [/\b(category|department)\b/i, faker.commerce.department],
      [/\b(brand|manufacturer)\b/i, faker.company.name],
      [/\b(material)\b/i, faker.commerce.productMaterial],
      [/\b(sku|code)\b/i, () => faker.string.alphanumeric(8).toUpperCase()],
      [/\bbarcode|ean|upc|isbn\b/i, () => faker.string.numeric(13)],
      [
        /\b(stock|quantity|inventory)\b/i,
        () => faker.number.int({ min: 0, max: 1000 }).toString()
      ],
      [/\bcolor\b/i, faker.color.human],
      [
        /\bsize\b/i,
        () => faker.helpers.arrayElement(["XS", "S", "M", "L", "XL", "XXL"])
      ],
      [
        /\bweight\b/i,
        () =>
          `${faker.number.float({ min: 0.1, max: 20, fractionDigits: 2 })} kg`
      ],
      [
        /\bdimensions\b/i,
        () =>
          `${faker.number.int({ min: 5, max: 50 })}x${faker.number.int({ min: 5, max: 50 })}x${faker.number.int({ min: 1, max: 30 })}`
      ],
      [
        /\btags?\b/i,
        () => faker.commerce.productAdjective().split(" ").join(",")
      ],
      [
        /\bdiscount\b/i,
        () =>
          faker.number.float({ min: 0, max: 0.5, fractionDigits: 2 }).toString()
      ],
      [/\bimage|photo|thumbnail\b/i, faker.image.url],
      [
        /\b(condition)\b/i,
        () =>
          faker.helpers.arrayElement(["new", "used", "refurbished", "open box"])
      ]
    ]
  },
  {
    model_pattern: /review|rating|feedback/i,
    matchers: [
      [
        /\b(text|content|body|message|review|feedback|comment)\b/i,
        faker.lorem.paragraph
      ],
      [
        /\b(rating|score)\b/i,
        () => faker.number.int({ min: 1, max: 5 }).toString()
      ],
      [
        /\b(status)\b/i,
        () => faker.helpers.arrayElement(["approved", "pending", "rejected"])
      ]
    ]
  },

  // Order / Transaction
  {
    model_pattern: /order|invoice|transaction|purchase|sale|checkout/i,
    matchers: [
      [
        /\b(order_?id|reference|number)\b/i,
        () => `ORD-${faker.string.alphanumeric(8).toUpperCase()}`
      ],
      [
        /\b(invoice_?number)\b/i,
        () => `INV-${faker.string.alphanumeric(8).toUpperCase()}`
      ],
      [/\b(total|amount|price|cost)\b/i, faker.finance.amount],
      [/\b(sub_?total)\b/i, () => faker.commerce.price({ min: 10, max: 500 })],
      [/\b(tax|vat)\b/i, () => faker.commerce.price({ min: 1, max: 100 })],
      [/\bshipping\b/i, () => faker.commerce.price({ min: 5, max: 50 })],
      [
        /\b(date|issued|placed|created)\b/i,
        () => faker.date.recent().toISOString()
      ],
      [
        /\b(status)\b/i,
        () =>
          faker.helpers.arrayElement([
            "pending",
            "processing",
            "shipped",
            "delivered",
            "cancelled"
          ])
      ],
      [
        /\b(payment_?method)\b/i,
        () =>
          faker.helpers.arrayElement([
            "credit_card",
            "paypal",
            "bank_transfer",
            "cash"
          ])
      ],
      [/\b(currency)\b/i, () => faker.finance.currencyCode()],
      [
        /\b(tracking_?number)\b/i,
        () => faker.string.alphanumeric(12).toUpperCase()
      ]
    ]
  },

  // Blog / News / Content
  {
    model_pattern: /blog|post|article|content|news|publication/i,
    matchers: [
      [/\b(title|headline)\b/i, faker.lorem.sentence],
      [/\b(body|content|html|text|copy)\b/i, faker.lorem.paragraphs],
      [/\b(caption|alt_?text)\b/i, faker.lorem.sentence],
      [/\b(summary|excerpt|snippet)\b/i, faker.lorem.paragraph],
      [/\b(tag|tags)\b/i, () => faker.lorem.words(3).split(" ").join(",")],
      [
        /\b(slug|permalink)\b/i,
        () => faker.helpers.slugify(faker.lorem.words(3))
      ],
      [
        /\b(published|created|date)\b/i,
        () => faker.date.recent().toISOString()
      ],
      [/\b(image|thumbnail|featured)\b/i, faker.image.url],
      [
        /\b(status)\b/i,
        () => faker.helpers.arrayElement(["draft", "published", "archived"])
      ]
    ]
  },

  // URL / Link
  {
    model_pattern: /url|link|shorten|redirect/i,
    matchers: [
      [/\b(url|link|original|long|target)\b/i, faker.internet.url],
      [/\b(slug|short|code|key)\b/i, () => faker.string.alphanumeric(6)],
      [/\b(title|name)\b/i, faker.lorem.sentence],
      [/\b(description)\b/i, faker.lorem.paragraph],
      [/\b(expires|expiry)\b/i, () => faker.date.future().toISOString()],
      [
        /\b(clicks|visits|views)\b/i,
        () => faker.number.int({ min: 0, max: 10000 }).toString()
      ],
      [/\b(active|status)\b/i, () => faker.datatype.boolean().toString()]
    ]
  },

  // Location / Geography
  {
    model_pattern: /location|place|address|geo/i,
    matchers: [
      [/\b(street|address|line1)\b/i, faker.location.streetAddress],
      [/\b(street2|line2|apt|suite)\b/i, faker.location.secondaryAddress],
      [/\b(city|town)\b/i, faker.location.city],
      [/\b(state|province|region|county)\b/i, faker.location.state],
      [/\b(country)\b/i, faker.location.country],
      [/\b(zip|postal)(_?code)?\b/i, faker.location.zipCode],
      [
        /\b(coordinates|lat_lng|position)\b/i,
        () => `${faker.location.latitude()},${faker.location.longitude()}`
      ],
      [/\b(latitude|lat)\b/i, () => faker.location.latitude().toString()],
      [/\b(longitude|lng|lon)\b/i, () => faker.location.longitude().toString()],
      [/\b(county|district)\b/i, faker.location.county],
      [
        /\b(building|apartment|suite|unit)_?(number|num|no)?\b/i,
        faker.location.buildingNumber
      ],
      [/\b(iso_?code|country_?code)\b/i, () => faker.location.countryCode()],
      [/\b(timezone|tz)\b/i, faker.location.timeZone],
      [
        /\b(area_?code)\b/i,
        () => faker.number.int({ min: 100, max: 999 }).toString()
      ]
    ]
  },

  // Vehicle
  {
    model_pattern: /vehicle|car|automobile|transportation/i,
    matchers: [
      [/\b(make|manufacturer|brand)\b/i, faker.vehicle.manufacturer],
      [/\b(model)\b/i, faker.vehicle.model],
      [/\b(type)\b/i, faker.vehicle.type],
      [
        /\b(year)\b/i,
        () => faker.date.past({ years: 20 }).getFullYear().toString()
      ],
      [/\b(color)\b/i, faker.vehicle.color],
      [/\b(vin|vehicle_?id)\b/i, faker.vehicle.vin],
      [/\b(plate|license|registration)\b/i, faker.vehicle.vrm],
      [/\b(fuel|fuel_?type)\b/i, faker.vehicle.fuel],
      [
        /\b(transmission)\b/i,
        () => faker.helpers.arrayElement(["automatic", "manual", "cvt"])
      ],
      [
        /\b(mileage|odometer)\b/i,
        () => faker.number.int({ min: 0, max: 150000 }).toString()
      ],
      [
        /\b(price|cost|value)\b/i,
        () => faker.commerce.price({ min: 5000, max: 100000 })
      ],
      [
        /\b(condition)\b/i,
        () => faker.helpers.arrayElement(["new", "used", "certified-pre-owned"])
      ]
    ]
  },

  // Education
  {
    model_pattern:
      /education|school|university|college|course|instructor|student/i,
    matchers: [
      [
        /\bcourse|class\b/i,
        () =>
          `${faker.lorem.words(2)} ${faker.number.int({ min: 101, max: 499 })}`
      ],
      [/\b(instructor|teacher|professor)\b/i, faker.person.fullName],
      [/\b(student|pupil)\b/i, faker.person.fullName],
      [
        /\b(degree)\b/i,
        () =>
          faker.helpers.arrayElement([
            "BA",
            "BS",
            "MA",
            "MS",
            "PhD",
            "MD",
            "JD"
          ])
      ],
      [/\b(subject|major)\b/i, faker.lorem.words],
      [
        /\b(gpa)\b/i,
        () =>
          faker.number
            .float({ min: 2.0, max: 4.0, fractionDigits: 2 })
            .toString()
      ],
      [
        /\bsemester\b/i,
        () =>
          faker.helpers.arrayElement(["Fall", "Spring", "Summer"]) +
          " " +
          faker.date.recent().getFullYear()
      ],
      [/\bcredits?\b/i, () => faker.number.int({ min: 1, max: 240 }).toString()]
    ]
  },

  // Healthcare
  {
    model_pattern: /health|medical|clinic|hospital|patient|doctor|nurse/i,
    matchers: [
      [/\b(patient)\b/i, faker.person.fullName],
      [/\b(doctor|physician)\b/i, faker.person.fullName],
      [/\b(nurse)\b/i, faker.person.fullName],
      [/\b(diagnosis)\b/i, faker.lorem.words],
      [
        /\b(medication)\b/i,
        () =>
          `${faker.lorem.word()} ${faker.number.int({ min: 5, max: 500 })}mg`
      ],
      [/\b(appointment|visit)\b/i, () => faker.date.future().toISOString()],
      [
        /\b(dob|birth(day|date))\b/i,
        () => faker.date.birthdate().toISOString()
      ],
      [
        /\bblood_?type\b/i,
        () => faker.helpers.arrayElement(["A+", "A-", "B+", "O+", "O-"])
      ],
      [/\bsymptoms?\b/i, () => faker.lorem.words(3)],
      [
        /\bprescription\b/i,
        () => `RX-${faker.string.alphanumeric(8).toUpperCase()}`
      ]
    ]
  },

  // Finance / Banking
  {
    model_pattern:
      /bank|finance|account|investment|loan|credit|wallet|payment|transaction/i,
    matchers: [
      [/\b(account_?number)\b/i, () => faker.finance.accountNumber()],
      [/\b(routing_?number)\b/i, () => faker.finance.routingNumber()],
      [/\b(name|cardholder)\b/i, faker.person.fullName],
      [/\b(card_?type)\b/i, faker.finance.creditCardIssuer],
      [/\b(iban)\b/i, faker.finance.iban],
      [/\b(bic|swift)\b/i, faker.finance.bic],
      [/\bbalance\b/i, faker.finance.amount],
      [/\bcurrency\b/i, () => faker.finance.currencyCode()],
      [/\b(credit_?card)\b/i, faker.finance.creditCardNumber],
      [
        /\b(cvv|cvc|card_?verification)\b/i,
        () => faker.finance.creditCardCVV()
      ],
      [/\b(transaction)\b/i, faker.finance.transactionType],
      [
        /\bexpiry|expiration\b/i,
        () =>
          `${faker.date.future().getMonth() + 1}/${faker.date.future().getFullYear().toString().substring(-2)}`
      ],
      [/\bcard(_number)?\b/i, faker.finance.creditCardNumber],
      [
        /\bpayment(_method)?\b/i,
        () =>
          faker.helpers.arrayElement([
            "Credit Card",
            "Debit Card",
            "PayPal",
            "Bank Transfer",
            "Cash"
          ])
      ],
      [
        /\b(status)\b/i,
        () =>
          faker.helpers.arrayElement([
            "pending",
            "completed",
            "failed",
            "refunded"
          ])
      ]
    ]
  },

  // Media
  {
    model_pattern: /\b(media|file|document|upload|attachment)\b/i,
    matchers: [
      [/\b(name|title|filename)\b/i, () => `${faker.system.fileName()}`],
      [
        /\b(path|url|location)\b/i,
        () => `uploads/${faker.system.commonFileName()}`
      ],
      [
        /\b(url|link|uri)\b/i,
        () => `https://cdn.example.com/${faker.system.filePath()}`
      ],
      [/\b(thumbnail|preview)(_?url)?\b/i, faker.image.url],
      [/\b(type|mime|mime_?type)\b/i, faker.system.mimeType],
      [
        /\b(size)\b/i,
        () => faker.number.int({ min: 1000, max: 10000000 }).toString()
      ],
      [/\b(extension|ext)\b/i, faker.system.fileExt],
      [/\b(description)\b/i, faker.lorem.sentence],
      [
        /\b(uploaded|created|added)\b/i,
        () => faker.date.recent().toISOString()
      ],
      [
        /\b(dimensions|resolution)\b/i,
        () =>
          `${faker.number.int({ min: 800, max: 3000 })}x${faker.number.int({ min: 600, max: 2000 })}`
      ],
      [/\b(duration)\b/i, () => `${faker.number.int({ min: 10, max: 3600 })}s`],
      [/\b(type|mime_?type)\b/i, faker.system.mimeType],
      [/\b(extension|ext)\b/i, faker.system.fileExt],
      [
        /\b(format)\b/i,
        () => faker.helpers.arrayElement(["jpg", "png", "pdf", "docx", "mp4"])
      ],
      [
        /\b(encoding)\b/i,
        () => faker.helpers.arrayElement(["7bit", "binary", "base64"])
      ]
    ]
  },

  // Social Media
  {
    model_pattern:
      /social|profile|post|feed|timeline|friend|connection|follow/i,
    matchers: [
      [/\b(username|handle)\b/i, faker.internet.username],
      [/\b(bio|about)\b/i, faker.lorem.paragraph],
      [/\b(profile|display)_?picture|avatar\b/i, faker.image.avatar],
      [/\b(post|status|tweet)\b/i, faker.lorem.sentence],
      [/\bstatus\b/i, faker.lorem.sentence],
      [/\bcaption\b/i, faker.lorem.sentence]
    ]
  },

  // Gaming
  {
    model_pattern: /game|gaming|player|score|level|achievement/i,
    matchers: [
      [/\b(username|gamer_tag)\b/i, faker.internet.username],
      [/\b(score)\b/i, () => `${faker.number.int({ min: 0, max: 100000 })}`],
      [/\b(level)\b/i, () => `${faker.number.int({ min: 1, max: 100 })}`],
      [/\b(achievement|badge)\b/i, faker.lorem.words]
    ]
  },

  // Travel / Tourism
  {
    model_pattern: /travel|tourism|flight|hotel|booking|itinerary/i,
    matchers: [
      [/\b(flight|airline)\b/i, () => faker.airline.airline().name],
      [/\b(hotel|accommodation)\b/i, faker.company.name],
      [
        /\b(booking|reservation)\b/i,
        () => `RES-${faker.string.alphanumeric(8).toUpperCase()}`
      ],
      [/\b(destination|location)\b/i, faker.location.city],
      [/\b(date)\b/i, () => faker.date.future().toISOString().split("T")[0]!]
    ]
  },

  // Restaurant / Food
  {
    model_pattern: /restaurant|food|menu|dish|cuisine/i,
    matchers: [
      [/\b(dish|meal|name)\b/i, faker.commerce.productName],
      [/\b(description)\b/i, faker.lorem.sentence],
      [/\b(price)\b/i, faker.finance.amount],
      [/\b(restaurant|cafe|diner)\b/i, faker.company.name]
    ]
  },

  // IoT / Sensor
  {
    model_pattern: /iot|sensor|device|measurement|telemetry|smart_?home/i,
    matchers: [
      [/\b(device|sensor)_?id\b/i, () => faker.string.uuid()],
      [
        /\bname\b/i,
        () => `${faker.word.adjective()} ${faker.word.noun()} Sensor`
      ],
      [
        /\bmodel\b/i,
        () =>
          `${faker.string.alphanumeric(2).toUpperCase()}-${faker.number.int({ min: 100, max: 999 })}`
      ],
      [/\bmanufacturer\b/i, faker.company.name],
      [
        /\bfirmware|version\b/i,
        () =>
          `${faker.number.int({ min: 1, max: 9 })}.${faker.number.int({ min: 0, max: 99 })}.${faker.number.int({ min: 0, max: 99 })}`
      ],
      [
        /\b(reading|measurement|value|data)\b/i,
        () =>
          faker.number.float({ min: 0, max: 100, fractionDigits: 2 }).toString()
      ],
      [
        /\b(unit|measure)\b/i,
        () =>
          faker.helpers.arrayElement([
            "°C",
            "°F",
            "%",
            "hPa",
            "lux",
            "ppm",
            "m/s"
          ])
      ],
      [
        /\b(battery|power)\b/i,
        () => `${faker.number.int({ min: 0, max: 100 })}%`
      ],
      [
        /\b(location|position|placement)\b/i,
        () =>
          faker.helpers.arrayElement([
            "Living Room",
            "Kitchen",
            "Bedroom",
            "Bathroom",
            "Garage",
            "Garden",
            "Office"
          ])
      ],
      [/\bip\b/i, faker.internet.ip],
      [/\bmac(_address)?\b/i, () => faker.number.hex(12)],
      [/\b(latitude|lat)\b/i, () => faker.location.latitude().toString()],
      [/\b(longitude|lng|lon)\b/i, () => faker.location.longitude().toString()],
      [
        /\bconnection|connectivity\b/i,
        () =>
          faker.helpers.arrayElement([
            "WiFi",
            "Bluetooth",
            "Zigbee",
            "Z-Wave",
            "LoRa",
            "Cellular",
            "Ethernet"
          ])
      ],
      [/\blast_?update|last_?seen\b/i, () => faker.date.recent().toISOString()],
      [
        /\blogger|threshold\b/i,
        () =>
          faker.number.float({ min: 0, max: 100, fractionDigits: 1 }).toString()
      ],
      [
        /\b(status)\b/i,
        () =>
          faker.helpers.arrayElement([
            "online",
            "offline",
            "standby",
            "error",
            "maintenance",
            "low_battery"
          ])
      ],
      [/\b(timestamp|time)\b/i, () => new Date().toISOString()]
    ]
  },

  // Real Estate
  {
    model_pattern:
      /property|real_?estate|house|housing|apartment|rent|rental|lease/i,
    matchers: [
      [/\b(address|street)\b/i, faker.location.streetAddress],
      [/\b(city)\b/i, faker.location.city],
      [/\b(state|province)\b/i, faker.location.state],
      [/\b(zip|postal_?code)\b/i, faker.location.zipCode],
      [/\b(price|rent)\b/i, faker.finance.amount],
      [
        /\b(type|category)\b/i,
        () =>
          faker.helpers.arrayElement(["apartment", "house", "villa", "condo"])
      ],
      [
        /\bsquare_?(feet|ft|footage|meters)\b/i,
        () => faker.number.int({ min: 500, max: 10000 }).toString()
      ],
      [
        /\bbedrooms|beds\b/i,
        () => faker.number.int({ min: 1, max: 7 }).toString()
      ],
      [
        /\bbathrooms|baths\b/i,
        () =>
          faker.number.float({ min: 1, max: 5, fractionDigits: 1 }).toString()
      ],
      [
        /\byear_?(built|construction)\b/i,
        () => faker.date.past({ years: 100 }).getFullYear().toString()
      ],
      [
        /\bstatus\b/i,
        () =>
          faker.helpers.arrayElement([
            "For Sale",
            "For Rent",
            "Sold",
            "Pending"
          ])
      ]
    ]
  },

  {
    model_pattern: /\b(company|organization|business|vendor|supplier)\b/i,
    matchers: [
      [/\b(name|title)\b/i, faker.company.name],
      [/\b(description|about)\b/i, faker.company.catchPhrase],
      [/\b(industry|sector)\b/i, faker.company.buzzNoun],
      [/\b(website|url|site)\b/i, faker.internet.url],
      [/\b(email)\b/i, faker.internet.email],
      [/\b(phone)\b/i, faker.phone.number],
      [
        /\b(founded|established)\b/i,
        () => faker.date.past({ years: 20 }).getFullYear().toString()
      ],
      [
        /\b(employees|size|headcount)\b/i,
        () => faker.number.int({ min: 1, max: 10000 }).toString()
      ],
      [
        /\b(revenue)\b/i,
        () => `$${faker.number.int({ min: 100000, max: 10000000 })}`
      ],
      [/\b(logo|image)\b/i, faker.image.url],
      [/\b(address)\b/i, faker.location.streetAddress],
      [/\b(city)\b/i, faker.location.city],
      [/\b(country)\b/i, faker.location.country],
      [
        /\b(status)\b/i,
        () => faker.helpers.arrayElement(["active", "inactive", "pending"])
      ]
    ]
  },

  // Logistics
  {
    model_pattern: /logistic|shipment|delivery|tracking|order/i,
    matchers: [
      [
        /\b(tracking_?id)\b/i,
        () => `TRK-${faker.string.alphanumeric(10).toUpperCase()}`
      ],
      [/\b(shipment|delivery)\b/i, faker.company.name],
      [/\b(route)\b/i, faker.lorem.words],
      [
        /\b(status)\b/i,
        () =>
          faker.helpers.arrayElement([
            "in transit",
            "delivered",
            "pending",
            "cancelled"
          ])
      ]
    ]
  },

  // Entertainment (Movies/TV)
  {
    model_pattern: /movie|film|tv|series|entertainment/i,
    matchers: [
      [/\b(title)\b/i, faker.lorem.words],
      [
        /\bgenre\b/i,
        () =>
          faker.helpers.arrayElement([
            "Action",
            "Comedy",
            "Drama",
            "Horror",
            "Sci-Fi",
            "Romance",
            "Documentary"
          ])
      ],
      [/\b(director)\b/i, faker.person.fullName],
      [
        /\b(rating)\b/i,
        () =>
          `${faker.number.float({ min: 1.0, max: 10.0, fractionDigits: 1 })}`
      ],
      [/\brelease(_date)?\b/i, () => faker.date.past().toISOString()]
    ]
  },

  // Job Board / Recruitment
  {
    model_pattern: /job|career|employment|recruitment|hiring|position|vacancy/i,
    matchers: [
      [/\b(title)\b/i, () => faker.lorem.words(3)],
      [/\bdescription\b/i, faker.lorem.paragraphs],
      [/\b(company)\b/i, faker.company.name],
      [/\b(salary)\b/i, faker.finance.amount],
      [/\b(location)\b/i, faker.location.city],
      [/\b(department)\b/i, faker.commerce.department],
      [
        /\bremote\b/i,
        () => faker.helpers.arrayElement(["Remote", "Hybrid", "On-site"])
      ],
      [
        /\bemployment_?type\b/i,
        () =>
          faker.helpers.arrayElement([
            "Full-time",
            "Part-time",
            "Contract",
            "Temporary",
            "Internship"
          ])
      ],
      [/\bskills|requirements\b/i, () => faker.lorem.words(5)],
      [
        /\bexperience\b/i,
        () => `${faker.number.int({ min: 1, max: 10 })}+ years`
      ]
    ]
  },

  // Music
  {
    model_pattern: /music|song|album|artist|band|track/i,
    matchers: [
      [/\b(title|name)\b/i, faker.lorem.words],
      [/\b(artist|band)\b/i, faker.person.fullName],
      [/\b(album)\b/i, () => faker.lorem.words(2)],
      [
        /\b(duration|length)\b/i,
        () => `${faker.number.int({ min: 120, max: 480 })} seconds`
      ]
    ]
  },

  // Analytics / Tracking / Events
  {
    model_pattern: /analytics|event|track|metric|log|stat|statistic/i,
    matchers: [
      [/\bevent_?name\b/i, () => faker.lorem.words(2)],
      [/\buser_?id\b/i, () => faker.string.uuid()],
      [/\bsession_?id\b/i, () => faker.string.uuid()],
      [/\bpage_?url\b/i, faker.internet.url],
      [/\btimestamp\b/i, () => new Date().toISOString()],
      [/\b(referrer|source)\b/i, faker.internet.url],
      [
        /\baction\b/i,
        () => faker.helpers.arrayElement(["click", "view", "purchase", "login"])
      ],
      [/\blabel\b/i, () => faker.lorem.word()],
      [/\bcategory\b/i, faker.commerce.department]
    ]
  },

  // Authentication / Security
  {
    model_pattern: /auth|login|signup|security|session|apikey/i,
    matchers: [
      [/\btoken\b/i, () => faker.string.alphanumeric(64)],
      [/\bpassword|hash\b/i, () => faker.string.alphanumeric(60)],
      [/\bsalt\b/i, () => faker.string.alphanumeric(16)],
      [/\b2fa|otp\b/i, () => faker.string.numeric(6)],
      [/\bip\b/i, faker.internet.ip],
      [/\buser_?agent\b/i, faker.internet.userAgent],
      [/\bexpires?\b/i, () => faker.date.future().toISOString()]
    ]
  },

  // Project Management / Tasks / Issues
  {
    model_pattern: /task|project|issue|ticket|bug|spring|backlog/i,
    matchers: [
      [/\btitle\b/i, faker.lorem.sentence],
      [/\bdescription\b/i, faker.lorem.paragraph],
      [
        /\bstatus\b/i,
        () =>
          faker.helpers.arrayElement([
            "open",
            "in progress",
            "closed",
            "resolved"
          ])
      ],
      [
        /\bpriority\b/i,
        () => faker.helpers.arrayElement(["low", "medium", "high", "urgent"])
      ],
      [/\bassignee\b/i, faker.person.fullName],
      [/\bcreated_?at\b/i, () => faker.date.past().toISOString()],
      [/\bdeadline|due(_date)?\b/i, () => faker.date.future().toISOString()],
      [/\bassignee\b/i, faker.person.fullName],
      [/\bestimate\b/i, () => `${faker.number.int({ min: 1, max: 8 })} hours`]
    ]
  },

  // Events / Calendar
  {
    model_pattern:
      /event|calendar|meeting|appointment|schedule|reservation|booking/i,
    matchers: [
      [/\btitle|name\b/i, faker.lorem.sentence],
      [
        /\b(start|start_?date|start_?time|begins)\b/i,
        () => faker.date.future().toISOString()
      ],
      [
        /\b(end|end_?date|end_?time|ends)\b/i,
        () => faker.date.future({}).toISOString()
      ],
      [
        /\bduration\b/i,
        () => `${faker.number.int({ min: 15, max: 180 })} minutes`
      ],
      [/\blocation\b/i, faker.location.streetAddress],
      [/\bvenue\b/i, faker.company.name],
      [/\brecurring\b/i, () => faker.datatype.boolean().toString()],
      [/\b(organizer|host)\b/i, faker.person.fullName],
      [
        /\b(capacity|max_?attendees)\b/i,
        () => faker.number.int({ min: 10, max: 1000 }).toString()
      ],
      [
        /\bfrequency\b/i,
        () =>
          faker.helpers.arrayElement([
            "daily",
            "weekly",
            "biweekly",
            "monthly",
            "yearly"
          ])
      ],
      [
        /\b(status)\b/i,
        () =>
          faker.helpers.arrayElement([
            "scheduled",
            "cancelled",
            "postponed",
            "completed"
          ])
      ],
      [/\b(url|link)\b/i, faker.internet.url]
    ]
  },

  // Notification / Communication / Chat / Messaging
  {
    model_pattern:
      /chat|thread|inbox|notification|message|alert|announcement|communication/i,
    matchers: [
      [/\b(title|subject|topic)\b/i, faker.lorem.sentence],
      [/\b(content|text|message|body)\b/i, faker.lorem.paragraph],
      [
        /\b(type|category)\b/i,
        () =>
          faker.helpers.arrayElement(["info", "warning", "error", "success"])
      ],
      [
        /\b(priority|urgency)\b/i,
        () => faker.helpers.arrayElement(["low", "medium", "high", "critical"])
      ],
      [/\b(sender|from|author|user)\b/i, faker.internet.username],
      [/\b(recipient|to|receiver)\b/i, faker.internet.username],
      [
        /\b(channel)\b/i,
        () => faker.helpers.arrayElement(["email", "sms", "push", "in-app"])
      ],
      [
        /\b(template|template_id)\b/i,
        () => `tpl-${faker.string.alphanumeric(8).toUpperCase()}`
      ],
      [
        /\b(status)\b/i,
        () =>
          faker.helpers.arrayElement(["sent", "delivered", "failed", "read"])
      ]
    ]
  },

  // API / Integration Systems
  {
    model_pattern: /api|endpoint|integration|webhook|service/i,
    matchers: [
      [/\b(name|title)\b/i, faker.lorem.words],
      [
        /\b(endpoint|url)\b/i,
        () =>
          `${faker.internet.url()}/api/v${faker.number.int({ min: 1, max: 3 })}`
      ],
      [
        /\b(method|http_method)\b/i,
        () =>
          faker.helpers.arrayElement(["GET", "POST", "PUT", "DELETE", "PATCH"])
      ],
      [/\b(version)\b/i, () => `v${faker.number.int({ min: 1, max: 5 })}`],
      [/\b(api_key|token)\b/i, () => faker.string.alphanumeric(32)],
      [/\b(secret)\b/i, () => faker.string.alphanumeric(64)],
      [
        /\b(status)\b/i,
        () => faker.helpers.arrayElement(["active", "inactive", "deprecated"])
      ],
      [
        /\b(rate_limit)\b/i,
        () => faker.number.int({ min: 100, max: 10000 }).toString()
      ]
    ]
  },

  // Configuration / Settings
  {
    model_pattern: /config|setting|preference|option|parameter/i,
    matchers: [
      [/\b(key|name)\b/i, faker.lorem.word],
      [/\b(value)\b/i, faker.lorem.word],
      [/\b(description)\b/i, faker.lorem.sentence],
      [
        /\b(type)\b/i,
        () =>
          faker.helpers.arrayElement([
            "string",
            "number",
            "boolean",
            "json",
            "array"
          ])
      ],
      [/\b(category|group)\b/i, faker.lorem.word],
      [/\b(default)\b/i, faker.lorem.word],
      [
        /\b(environment)\b/i,
        () =>
          faker.helpers.arrayElement(["development", "staging", "production"])
      ],
      [
        /\b(is_sensitive|protected)\b/i,
        () => faker.datatype.boolean().toString()
      ],
      [/\b(last_modified)\b/i, () => faker.date.recent().toISOString()]
    ]
  },

  // Audit / Logging
  {
    model_pattern: /audit|log|activity|history|changelog/i,
    matchers: [
      [
        /\b(action|operation)\b/i,
        () =>
          faker.helpers.arrayElement([
            "create",
            "update",
            "delete",
            "view",
            "export"
          ])
      ],
      [/\b(actor|user)\b/i, faker.internet.userName],
      [/\b(ip_address)\b/i, faker.internet.ip],
      [/\b(resource|target)\b/i, faker.system.fileName],
      [/\b(timestamp|time)\b/i, () => faker.date.recent().toISOString()],
      [/\b(details|changes)\b/i, faker.lorem.sentence],
      [
        /\b(status)\b/i,
        () => faker.helpers.arrayElement(["success", "failure", "pending"])
      ],
      [/\b(correlation_id|request_id)\b/i, () => faker.string.uuid()],
      [
        /\b(severity|level)\b/i,
        () =>
          faker.helpers.arrayElement([
            "debug",
            "info",
            "warn",
            "error",
            "critical"
          ])
      ]
    ]
  },

  // NEW: Subscription / Membership
  {
    model_pattern: /subscription|membership|plan|tier|billing/i,
    matchers: [
      [
        /\b(name|title|plan)\b/i,
        () =>
          faker.helpers.arrayElement([
            "Basic",
            "Premium",
            "Professional",
            "Enterprise",
            "Free",
            "Standard",
            "Plus",
            "Ultimate"
          ])
      ],
      [/\b(description)\b/i, faker.lorem.sentence],
      [
        /\b(price|amount|cost|fee)\b/i,
        () => faker.commerce.price({ min: 5, max: 100 })
      ],
      [/\b(currency)\b/i, () => faker.finance.currencyCode()],
      [
        /\b(interval|period|frequency)\b/i,
        () =>
          faker.helpers.arrayElement([
            "monthly",
            "annually",
            "weekly",
            "quarterly",
            "daily"
          ])
      ],
      [
        /\b(trial(_period|_days)?)\b/i,
        () => faker.number.int({ min: 0, max: 30 }).toString()
      ],
      [
        /\b(active|status)\b/i,
        () =>
          faker.helpers.arrayElement([
            "active",
            "canceled",
            "expired",
            "pending",
            "past_due"
          ])
      ],
      [
        /\b(created|start_date|subscribed_at)\b/i,
        () => faker.date.past().toISOString()
      ],
      [
        /\b(expires|end_date|renewal_date)\b/i,
        () => faker.date.future().toISOString()
      ],
      [/\b(canceled_at)\b/i, () => faker.date.recent().toISOString()],
      [
        /\b(max_users|seats)\b/i,
        () => faker.number.int({ min: 1, max: 100 }).toString()
      ],
      [
        /\b(payment_method)\b/i,
        () =>
          faker.helpers.arrayElement([
            "credit_card",
            "paypal",
            "bank_transfer",
            "crypto"
          ])
      ]
    ]
  },

  // NEW: Sports / Athletics
  {
    model_pattern:
      /sport|athlete|team|match|game|tournament|league|competition/i,
    matchers: [
      [
        /\b(name|title|team)\b/i,
        () => `${faker.location.city()} ${faker.animal.type()}s`
      ],
      [/\b(player|athlete|participant)\b/i, faker.person.fullName],
      [
        /\b(sport|game|activity)\b/i,
        () =>
          faker.helpers.arrayElement([
            "Football",
            "Basketball",
            "Baseball",
            "Soccer",
            "Tennis",
            "Hockey",
            "Golf",
            "Rugby",
            "Cricket",
            "Volleyball"
          ])
      ],
      [
        /\b(league|conference|division)\b/i,
        () => `${faker.word.adjective()} ${faker.word.noun()} League`
      ],
      [
        /\b(score|points|result)\b/i,
        () =>
          `${faker.number.int({ min: 0, max: 100 })}-${faker.number.int({ min: 0, max: 100 })}`
      ],
      [
        /\b(position|role)\b/i,
        () =>
          faker.helpers.arrayElement([
            "Forward",
            "Defense",
            "Goalkeeper",
            "Striker",
            "Quarterback",
            "Center",
            "Pitcher",
            "Guard"
          ])
      ],
      [
        /\b(jersey|number)\b/i,
        () => faker.number.int({ min: 1, max: 99 }).toString()
      ],
      [
        /\b(venue|stadium|arena|field|court)\b/i,
        () => `${faker.company.name()} Stadium`
      ],
      [/\b(start|date|scheduled)\b/i, () => faker.date.future().toISOString()],
      [
        /\b(duration|length|time)\b/i,
        () => `${faker.number.int({ min: 90, max: 180 })} minutes`
      ],
      [
        /\b(season|year)\b/i,
        () => faker.date.recent().getFullYear().toString()
      ],
      [
        /\b(rank|standing|position)\b/i,
        () => faker.number.int({ min: 1, max: 20 }).toString()
      ],
      [
        /\b(win|victory|loss|defeat)\b/i,
        () => faker.datatype.boolean().toString()
      ],
      [/\b(home|away)\b/i, () => faker.datatype.boolean().toString()],
      [
        /\b(status)\b/i,
        () =>
          faker.helpers.arrayElement([
            "scheduled",
            "in_progress",
            "finished",
            "canceled",
            "postponed"
          ])
      ]
    ]
  },

  // ML/AI Models and Data
  {
    model_pattern: /ai|ml|model|dataset|training|prediction|algorithm/i,
    matchers: [
      [
        /\b(name|title|model_name)\b/i,
        () =>
          `${faker.word.adjective()}-${faker.word.noun()}-${faker.number.int({ min: 1, max: 999 })}`
      ],
      [/\b(description)\b/i, faker.lorem.paragraph],
      [
        /\b(version|release)\b/i,
        () =>
          `${faker.number.int({ min: 0, max: 5 })}.${faker.number.int({ min: 0, max: 9 })}.${faker.number.int({ min: 0, max: 9 })}`
      ],
      [
        /\b(accuracy|precision|recall|f1|score)\b/i,
        () =>
          faker.number
            .float({ min: 0.7, max: 0.99, fractionDigits: 4 })
            .toString()
      ],
      [
        /\b(parameters|params)\b/i,
        () => faker.number.int({ min: 10000, max: 175000000000 }).toString()
      ],
      [
        /\b(epochs|iterations|steps)\b/i,
        () => faker.number.int({ min: 10, max: 1000 }).toString()
      ],
      [
        /\b(learning_rate|lr)\b/i,
        () =>
          faker.number
            .float({ min: 0.0001, max: 0.1, fractionDigits: 6 })
            .toString()
      ],
      [
        /\b(batch_size)\b/i,
        () => faker.helpers.arrayElement(["8", "16", "32", "64", "128", "256"])
      ],
      [
        /\b(framework|library)\b/i,
        () =>
          faker.helpers.arrayElement([
            "TensorFlow",
            "PyTorch",
            "Keras",
            "JAX",
            "scikit-learn",
            "XGBoost"
          ])
      ],
      [
        /\b(dataset|data)\b/i,
        () =>
          faker.helpers.arrayElement([
            "MNIST",
            "ImageNet",
            "CIFAR-10",
            "COCO",
            "WikiText",
            "Custom"
          ])
      ],
      [
        /\b(loss|error)\b/i,
        () =>
          faker.number
            .float({ min: 0.01, max: 2.5, fractionDigits: 4 })
            .toString()
      ],
      [
        /\b(training_time|duration)\b/i,
        () => `${faker.number.int({ min: 1, max: 100 })} hours`
      ],
      [
        /\b(gpu|hardware)\b/i,
        () =>
          faker.helpers.arrayElement([
            "NVIDIA A100",
            "NVIDIA V100",
            "NVIDIA RTX 3090",
            "TPU v3",
            "CPU only"
          ])
      ],
      [
        /\b(status)\b/i,
        () =>
          faker.helpers.arrayElement([
            "training",
            "completed",
            "failed",
            "evaluating",
            "deployed"
          ])
      ],
      [/\b(created_at|trained_at)\b/i, () => faker.date.recent().toISOString()]
    ]
  },

  // NEW: Library / Content Management / Publishing
  {
    model_pattern:
      /library|book|publication|author|catalog|archive|collection/i,
    matchers: [
      [/\b(title|name)\b/i, faker.lorem.words],
      [/\b(author|writer|creator)\b/i, faker.person.fullName],
      [/\b(isbn|id|code)\b/i, () => faker.string.numeric(13)],
      [/\b(publisher|press)\b/i, faker.company.name],
      [/\b(published|release_date)\b/i, () => faker.date.past().toISOString()],
      [
        /\b(pages|length)\b/i,
        () => faker.number.int({ min: 50, max: 1200 }).toString()
      ],
      [
        /\b(language)\b/i,
        () =>
          faker.helpers.arrayElement([
            "English",
            "Spanish",
            "French",
            "German",
            "Chinese",
            "Japanese"
          ])
      ],
      [
        /\b(genre|category)\b/i,
        () =>
          faker.helpers.arrayElement([
            "Fiction",
            "Non-fiction",
            "Science",
            "History",
            "Biography",
            "Fantasy",
            "Romance",
            "Mystery"
          ])
      ],
      [/\b(summary|description|blurb)\b/i, faker.lorem.paragraph],
      [/\b(cover|image|thumbnail)\b/i, faker.image.url],
      [
        /\b(edition|version)\b/i,
        () => faker.number.int({ min: 1, max: 10 }).toString()
      ],
      [
        /\b(rating|score)\b/i,
        () =>
          faker.number.float({ min: 1, max: 5, fractionDigits: 1 }).toString()
      ],
      [
        /\b(reviews|ratings)\b/i,
        () => faker.number.int({ min: 0, max: 5000 }).toString()
      ],
      [/\b(available|in_stock)\b/i, () => faker.datatype.boolean().toString()],
      [
        /\b(borrowed|checked_out)\b/i,
        () => faker.datatype.boolean().toString()
      ],
      [/\b(due_date|return_date)\b/i, () => faker.date.future().toISOString()],
      [
        /\b(status|condition)\b/i,
        () =>
          faker.helpers.arrayElement([
            "available",
            "checked_out",
            "reserved",
            "lost",
            "damaged"
          ])
      ]
    ]
  },

  // Human Resources
  {
    model_pattern: /hr|human[- ]?resources|employee|staff|personnel/i,
    matchers: [
      [/\bemployee_?id\b/i, () => `EMP-${faker.string.alphanumeric(8)}`],
      [/\bdepartment\b/i, faker.commerce.department],
      [/\bposition|job_?title\b/i, faker.person.jobTitle],
      [/\bsalary\b/i, () => faker.finance.amount({ min: 30000, max: 200000 })],
      [/\bhire_?date\b/i, () => faker.date.past({ years: 10 }).toISOString()],
      [/\bmanager\b/i, faker.person.fullName],
      [/\bemergency_?contact\b/i, faker.phone.number],
      [
        /\bemployment_?type\b/i,
        () =>
          faker.helpers.arrayElement([
            "Full-time",
            "Part-time",
            "Contract",
            "Temporary"
          ])
      ],
      [
        /\bstatus\b/i,
        () =>
          faker.helpers.arrayElement([
            "active",
            "on leave",
            "terminated",
            "retired"
          ])
      ],
      [
        /\bperformance\b/i,
        () =>
          faker.helpers.arrayElement(["exceeds", "meets", "needs improvement"])
      ]
    ]
  },

  // Legal / Contracts
  {
    model_pattern: /legal|contract|agreement|clause|terms|law/i,
    matchers: [
      [/\bcontract_?id\b/i, () => `CNT-${faker.string.alphanumeric(8)}`],
      [
        /\bparties\b/i,
        () => `${faker.company.name()} and ${faker.company.name()}`
      ],
      [/\beffective_?date\b/i, () => faker.date.future().toISOString()],
      [
        /\bexpiration_?date\b/i,
        () => faker.date.future({ years: 5 }).toISOString()
      ],
      [
        /\bstatus\b/i,
        () =>
          faker.helpers.arrayElement([
            "draft",
            "active",
            "expired",
            "terminated"
          ])
      ],
      [/\bjurisdiction\b/i, faker.location.country],
      [
        /\bversion\b/i,
        () => `v${faker.number.int({ min: 1, max: 5 })}.${faker.number.int(9)}`
      ],
      [/\bterms\b/i, faker.lorem.paragraphs],
      [/\bsignature\b/i, () => `signed by ${faker.person.fullName()}`]
    ]
  },

  // Insurance
  {
    model_pattern: /insurance|policy|claim|coverage|premium/i,
    matchers: [
      [/\bpolicy_?number\b/i, () => `PLCY-${faker.string.alphanumeric(8)}`],
      [/\bclaim_?number\b/i, () => `CLM-${faker.string.alphanumeric(8)}`],
      [/\binsured\b/i, faker.person.fullName],
      [/\bprovider\b/i, faker.company.name],
      [/\bpremium\b/i, () => faker.finance.amount({ min: 100, max: 1000 })],
      [
        /\bcoverage\b/i,
        () => faker.finance.amount({ min: 10000, max: 1000000 })
      ],
      [
        /\btype\b/i,
        () =>
          faker.helpers.arrayElement([
            "auto",
            "home",
            "life",
            "health",
            "travel"
          ])
      ],
      [
        /\bstatus\b/i,
        () =>
          faker.helpers.arrayElement([
            "active",
            "expired",
            "pending",
            "canceled"
          ])
      ],
      [/\bdeductible\b/i, () => faker.finance.amount({ min: 100, max: 5000 })],
      [/\bagent\b/i, faker.person.fullName]
    ]
  },

  // Government / Public Sector
  {
    model_pattern: /government|govt|public|citizen|voter|tax/i,
    matchers: [
      [
        /\bssn|social_?security\b/i,
        () =>
          faker.string.numeric(9).replace(/^(\d{3})(\d{2})(\d{4})$/, "$1-$2-$3")
      ],
      [/\bpassport\b/i, () => faker.string.alphanumeric(9).toUpperCase()],
      [
        /\bdriver_?license\b/i,
        () => faker.string.alphanumeric(10).toUpperCase()
      ],
      [/\btax_?id\b/i, () => faker.string.numeric(9)],
      [/\bcase_?number\b/i, () => faker.string.numeric(10)],
      [/\blicense_?plate\b/i, () => faker.vehicle.vrm()],
      [/\bdistrict\b/i, faker.location.county],
      [/\bconstituency\b/i, faker.location.state]
    ]
  },

  // Non-Profit / Charity
  {
    model_pattern: /non[- ]?profit|charity|donation|ngo|foundation/i,
    matchers: [
      [/\bdonation_?id\b/i, () => `DON-${faker.string.alphanumeric(8)}`],
      [/\bdonor\b/i, faker.person.fullName],
      [/\bcampaign\b/i, faker.lorem.words],
      [/\bamount\b/i, () => faker.finance.amount({ min: 10, max: 10000 })],
      [
        /\bcause\b/i,
        () =>
          faker.helpers.arrayElement([
            "education",
            "health",
            "environment",
            "animals"
          ])
      ],
      [
        /\bmembership_?level\b/i,
        () =>
          faker.helpers.arrayElement(["bronze", "silver", "gold", "platinum"])
      ],
      [/\bvolunteer\b/i, faker.person.fullName],
      [/\bmission\b/i, faker.company.catchPhrase]
    ]
  },

  // Technology / IT
  {
    model_pattern:
      /tech|technology|it|software|hardware|system|server|network/i,
    matchers: [
      [/\bip_?address\b/i, faker.internet.ip],
      [/\bmac_?address\b/i, faker.internet.mac],
      [/\bhostname\b/i, faker.internet.domainWord],
      [/\bdomain\b/i, faker.internet.domainName],
      [
        /\bos|operating_?system\b/i,
        () =>
          faker.helpers.arrayElement([
            "Windows",
            "macOS",
            "Linux",
            "Android",
            "iOS"
          ])
      ],
      [
        /\bbrowser\b/i,
        () =>
          faker.helpers.arrayElement(["Chrome", "Firefox", "Safari", "Edge"])
      ],
      [
        /\bversion\b/i,
        () =>
          `${faker.number.int({ min: 1, max: 20 })}.${faker.number.int(9)}.${faker.number.int(99)}`
      ],
      [
        /\bserial_?number\b/i,
        () => faker.string.alphanumeric(12).toUpperCase()
      ],
      [
        /\bmodel_?number\b/i,
        () => `${faker.string.alpha(2)}-${faker.string.numeric(4)}`
      ],
      [/\basset_?tag\b/i, () => `AST-${faker.string.alphanumeric(6)}`]
    ]
  },

  // Manufacturing
  {
    model_pattern:
      /manufacturing|factory|plant|production|assembly|supply_?chain/i,
    matchers: [
      [/\bbatch_?number\b/i, () => `BCH-${faker.string.alphanumeric(8)}`],
      [
        /\bserial_?number\b/i,
        () => faker.string.alphanumeric(12).toUpperCase()
      ],
      [/\bwork_?order\b/i, () => `WO-${faker.string.alphanumeric(8)}`],
      [/\boperator\b/i, faker.person.fullName],
      [
        /\bshift\b/i,
        () => faker.helpers.arrayElement(["morning", "afternoon", "night"])
      ],
      [
        /\bqc_?status\b/i,
        () => faker.helpers.arrayElement(["passed", "failed", "pending"])
      ],
      [/\byield\b/i, () => `${faker.number.int({ min: 80, max: 100 })}%`],
      [
        /\bdefect_?rate\b/i,
        () => `${faker.number.float({ min: 0.1, max: 5, fractionDigits: 2 })}%`
      ]
    ]
  },

  // Energy / Utilities
  {
    model_pattern: /energy|utility|power|electric|water|gas|oil/i,
    matchers: [
      [/\bmeter_?number\b/i, () => faker.string.numeric(10)],
      [/\baccount_?number\b/i, () => faker.string.numeric(12)],
      [
        /\bconsumption\b/i,
        () => `${faker.number.int({ min: 100, max: 2000 })} kWh`
      ],
      [/\bbill_?amount\b/i, () => faker.finance.amount({ min: 50, max: 500 })],
      [
        /\breading\b/i,
        () => faker.number.int({ min: 10000, max: 99999 }).toString()
      ],
      [
        /\bservice_?type\b/i,
        () =>
          faker.helpers.arrayElement([
            "residential",
            "commercial",
            "industrial"
          ])
      ],
      [
        /\btariff\b/i,
        () =>
          faker.helpers.arrayElement(["standard", "time-of-use", "flat-rate"])
      ]
    ]
  },

  // Sports / Fitness
  {
    model_pattern: /sport|fitness|athlete|team|game|match|workout/i,
    matchers: [
      [/\bplayer_?name\b/i, faker.person.fullName],
      [/\bteam\b/i, faker.company.name],
      [
        /\bposition\b/i,
        () =>
          faker.helpers.arrayElement([
            "forward",
            "midfielder",
            "defender",
            "goalkeeper"
          ])
      ],
      [/\bscore\b/i, () => faker.number.int({ min: 0, max: 100 }).toString()],
      [
        /\bstatistics\b/i,
        () =>
          `${faker.number.int(50)}/${faker.number.int(30)}/${faker.number.int(20)}`
      ],
      [
        /\bworkout_?type\b/i,
        () => faker.helpers.arrayElement(["cardio", "strength", "HIIT", "yoga"])
      ],
      [
        /\bduration\b/i,
        () => `${faker.number.int({ min: 15, max: 120 })} minutes`
      ],
      [
        /\bheart_?rate\b/i,
        () => faker.number.int({ min: 60, max: 190 }).toString()
      ]
    ]
  }
];

export const generic: [RegExp, () => string][] = [
  [/\bfirst(name)?\b/i, faker.person.firstName],
  [/\bmiddle(name)?\b/i, faker.person.middleName],
  [/\blast(name)?\b/i, faker.person.lastName],
  [/\b(full)?name\b/i, faker.person.fullName],
  [/email/i, faker.internet.email],
  [/username/i, faker.internet.username],
  [/phone|tel/i, faker.phone.number],
  [/address/i, faker.location.streetAddress],
  [/city/i, faker.location.city],
  [/country/i, faker.location.country],
  [/\bzip\b/i, faker.location.zipCode],
  [/\b(url|website)\b/i, faker.internet.url],
  [/\b(description|bio)\b/i, faker.lorem.paragraph],
  [/\btitle\b/i, faker.lorem.sentence],
  [/\b(image|avatar|photo)\b/i, faker.image.url],
  [/\bcolor\b/i, faker.color.rgb],
  [/\b(twitter|x|github|linkedin|facebook|instagram)\b/i, faker.internet.url],
  [/\bip\b/i, faker.internet.ip],
  [/\bmac\b/i, faker.internet.mac],
  [/\b(company|organization|employer)\b/i, faker.company.name],
  [/\b(currency|price|cost|amount)\b/i, faker.finance.amount],
  [/\b(job|profession|occupation)\b/i, faker.person.jobTitle],
  [/\bgender\b/i, faker.person.sexType],
  [/\b(uuid|id|slug|token)\b/i, faker.string.uuid],

  [/\bproduct\b/i, faker.commerce.productName],
  [/\bsku\b/i, () => faker.string.alphanumeric(8).toUpperCase()],
  [/\bbarcode|ean|upc\b/i, () => faker.string.numeric(13)],
  [/\bcategory\b/i, faker.commerce.department],
  [/\bproduct_?desc(ription)?\b/i, faker.commerce.productDescription],
  [/\bmaterial\b/i, faker.commerce.productMaterial],
  [/\bbrand\b/i, faker.company.name],
  [
    /\bmodel\b/i,
    () => `${faker.string.alpha(2).toUpperCase()}-${faker.string.numeric(4)}`
  ],

  [/\blatitude\b/i, () => faker.location.latitude().toString()],
  [/\blongitude\b/i, () => faker.location.longitude().toString()],
  [
    /\bcoordinates?\b/i,
    () => `${faker.location.latitude()},${faker.location.longitude()}`
  ],
  [/\bstate|province\b/i, faker.location.state],
  [/\bpostal_?code\b/i, faker.location.zipCode],
  [/\bcounty\b/i, faker.location.county],
  [/\btimezone\b/i, faker.location.timeZone],
  [/\bstreet\b/i, faker.location.street],
  [
    /\b(building|apartment|suite|unit)_?(number|num|no)?\b/i,
    () => faker.location.buildingNumber()
  ],

  [/\bsubject\b/i, faker.lorem.sentence],
  [/\bmessage|content|body\b/i, faker.lorem.paragraphs],
  [/\bcomment\b/i, faker.lorem.paragraph],
  [/\bheadline\b/i, faker.lorem.sentence],
  [/\bslogan\b/i, faker.company.catchPhrase],
  [/\bfax\b/i, faker.phone.number],

  [/\baccount_?number\b/i, () => faker.finance.accountNumber()],
  [/\broutin?g_?number\b/i, () => faker.finance.routingNumber()],
  [/\biban\b/i, faker.finance.iban],
  [/\bcredit_?card\b/i, faker.finance.creditCardNumber],
  [/\bcvv|cvc|card_?verification\b/i, () => faker.finance.creditCardCVV()],
  [
    /\b(card_?exp(iry)?|expiration)\b/i,
    () => faker.date.future().toISOString().substring(0, 7)
  ],
  [/\btransaction\b/i, faker.finance.transactionType],
  [/\binvoice\b/i, () => `INV-${faker.string.alphanumeric(8).toUpperCase()}`],

  [/\b(dob|birth(day|date))\b/i, () => faker.date.birthdate().toISOString()],
  [/\bappointment\b/i, () => faker.date.future().toISOString()],
  [/\bevent_?date\b/i, () => faker.date.future().toISOString().split("T")[0]!],
  [
    /\btime\b/i,
    () => faker.date.future().toISOString().split("T")[1]!.split(".")[0]!
  ],

  [/\bthumbnail\b/i, faker.image.avatar],
  [/\bvideo\b/i, () => `https://example.com/videos/${faker.string.nanoid()}`],
  [/\baudio\b/i, () => `https://example.com/audio/${faker.string.nanoid()}`],
  [/\btags?\b/i, () => faker.lorem.words(3).split(" ").join(",")],

  [/\bapi_?key\b/i, () => faker.string.alphanumeric(32)],
  [/\baccess_?token\b/i, () => `${faker.string.alphanumeric(64)}`],
  [/\brefresh_?token\b/i, () => `${faker.string.alphanumeric(64)}`],
  [/\bsecret\b/i, faker.string.uuid],
  [/\bsalt\b/i, () => faker.string.alphanumeric(16)],
  [/\bipv[46]\b/i, faker.internet.ip],
  [/\buser_?agent\b/i, faker.internet.userAgent],

  [/\bbook_?title\b/i, faker.lorem.words],
  [/\bisbn\b/i, () => `978-${faker.string.numeric(10)}`],
  [/\bauthor\b/i, faker.person.fullName],
  [/\bpublisher\b/i, faker.company.name],
  [/\bhealth_?(insurance|provider)\b/i, faker.company.name],
  [/\bdiagnosis\b/i, faker.lorem.words],
  [
    /\bmedication\b/i,
    () => `${faker.lorem.word()} ${faker.number.int({ min: 5, max: 500 })}mg`
  ],
  [
    /\bblood_?type\b/i,
    () =>
      faker.helpers.arrayElement([
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-"
      ])
  ],
  [/\bheight\b/i, () => `${faker.number.int({ min: 150, max: 200 })} cm`],
  [/\bweight\b/i, () => `${faker.number.int({ min: 45, max: 120 })} kg`],
  [
    /\bcourse\b/i,
    () => `${faker.lorem.words(2)} ${faker.number.int({ min: 101, max: 499 })}`
  ],
  [
    /\bdegree\b/i,
    () =>
      faker.helpers.arrayElement(["BA", "BS", "MA", "MS", "PhD", "MD", "JD"])
  ],
  [/\bmajor\b/i, faker.lorem.words],
  [
    /\bgpa\b/i,
    () =>
      faker.number.float({ min: 2.0, max: 4.0, fractionDigits: 2 }).toString()
  ],
  [/\bdepartment\b/i, faker.commerce.department],
  [/\breference_?id\b/i, () => faker.string.alphanumeric(8).toUpperCase()],
  [
    /\bserial_?num(ber)?\b/i,
    () => `${faker.string.alpha(3).toUpperCase()}-${faker.string.numeric(5)}`
  ],
  [
    /\bversion\b/i,
    () =>
      `${faker.number.int({ min: 1, max: 5 })}.${faker.number.int({ min: 0, max: 20 })}.${faker.number.int({ min: 0, max: 99 })}`
  ],
  [
    /\blicense(_?key)?\b/i,
    () =>
      faker.string.alphanumeric(24).toUpperCase().match(/.{4}/g)?.join("-") ||
      ""
  ],
  [/\btags?\b/i, () => faker.lorem.words(3).split(" ").join(",")],
  [
    /\bcontent_?type\b/i,
    () =>
      faker.helpers.arrayElement([
        "text/html",
        "application/json",
        "text/plain",
        "application/xml"
      ])
  ],
  [
    /(skill|technology|language|framework)/i,
    () =>
      faker.helpers.arrayElement([
        "JavaScript",
        "Python",
        "Java",
        "C#",
        "PHP",
        "TypeScript",
        "Ruby",
        "React",
        "Angular",
        "Vue",
        "Node.js",
        "MongoDB",
        "MySQL",
        "PostgreSQL",
        "HTML",
        "CSS",
        "AWS",
        "Docker",
        "Kubernetes",
        "Git"
      ])
  ]
];
