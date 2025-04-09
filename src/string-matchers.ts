import { faker } from "@faker-js/faker";

export const matchers: [RegExp, () => string][] = [
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

  // product related
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

  // location specific
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

  // communication & contact
  [/\bsubject\b/i, faker.lorem.sentence],
  [/\bmessage|content|body\b/i, faker.lorem.paragraphs],
  [/\bcomment\b/i, faker.lorem.paragraph],
  [/\bheadline\b/i, faker.lorem.sentence],
  [/\bslogan\b/i, faker.company.catchPhrase],
  [/\bfax\b/i, faker.phone.number],

  // financial
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

  // date & time
  [/\b(dob|birth(day|date))\b/i, () => faker.date.birthdate().toISOString()],
  [/\bappointment\b/i, () => faker.date.future().toISOString()],
  [/\bevent_?date\b/i, () => faker.date.future().toISOString().split("T")[0]!],
  [
    /\btime\b/i,
    () => faker.date.future().toISOString().split("T")[1]!.split(".")[0]!
  ],

  // media & content
  [/\bthumbnail\b/i, faker.image.avatar],
  [/\bvideo\b/i, () => `https://example.com/videos/${faker.string.uuid()}`],
  [/\baudio\b/i, () => `https://example.com/audio/${faker.string.uuid()}`],
  [/\btags?\b/i, () => faker.lorem.words(3).split(" ").join(",")],

  // user account & security
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
  ]
];
