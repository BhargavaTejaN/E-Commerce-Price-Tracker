import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractDescription, extractPrice, extractRating, extractReviewsCount } from "../utils";

export async function scrapeAmazonProduct(url: string) {
  if (!url) return;

  // bright data proxy configuration
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (100000 * Math.random()) | 0;

  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password: password,
    },
    host: "brd.superproxy.io",
    port,
    rejectUnauthorized: false,
  };

  try {
    // Fetch the product page
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);

    const title = $("#productTitle").text().trim();

    const currentPrice = extractPrice(
      $(".priceToPay span.a-price-whole"),
      $(".a.size.base.a-color-price"),
      $(".a-button-selected .a-color-base")
    );

    // const originalPrice = extractPrice(
    //   $("#priceblock_ourprice"),
    //   $('.span.a-offscreen'),
    //   $('span.a-offscreen'),
    //   $('.span.a-price.a-text-price'),
    //   $('span.a-price.a-text-price'),
    //   $(".a-price.a-text-price span.a-offscreen"),
    //   $(".span.a-price.a-text-price span.a-offscreen"),
    //   $("span.a-price.a-text-price span.a-offscreen"),
    //   $("#listPrice"),
    //   $("#priceblock_dealprice"),
    //   $(".a-size-base.a-color-price"),
    //   $('.a-section.a-spacing-small.aok-align-center span.aok-relative span.a-price.a-text-price span.a-offscreen'),
    //   $(".priceBlockStrikePriceString"),
    //   $(".a-text-price .a-offscreen"),
    //   $("#priceblock_ourprice"),
    //   $("#priceblock_dealprice"),
    //   $(".a-price .a-offscreen"),
    //   $(".a-price .a-offscreen span"),
    //   $(".priceBlockStrikePriceString"),
    //   $(".a-size-base.a-color-price"),
    //   $(".priceBlockSavingsString"),
    //   $("#original-price"),
    //   $(".a-text-price .a-offscreen"),
    //   $(".priceBlockListPriceString"),
    //   $(".a-price-whole a-list-price .a-price-whole .saleprice")
    // );

    const originalPrice = extractPrice(
      $('#priceblock_ourprice'),
      $('.a-price.a-text-price span.a-offscreen'),
      $('#listPrice'),
      $('#priceblock_dealprice'),
      $('.a-size-base.a-color-price'),
      $('#priceblock_ourprice'),
      $('.span.a-offscreen'),
      $('span.a-price.a-text-price'),
      $('#listPrice'),
      $('#priceblock_dealprice'),
      $('.a-size-base.a-color-price'),
      $('.a-section.a-spacing-small.aok-align-center span.aok-relative span.a-price.a-text-price span.a-offscreen'),
      $('.priceBlockStrikePriceString'),
      $('.a-text-price .a-offscreen'),
      $("#original-price"),
      $('.priceBlockListPriceString'),
      $('.a-price-whole a-list-price .a-price-whole .saleprice'),
    );

    const outOfStock =
      $("#availability span").text().trim().toLowerCase() ===
      "currently unavailable";

    const images =
      $("#imgBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage").attr("data-a-dynamic-image") ||
      "{}";

    const imageUrls = Object.keys(JSON.parse(images));

    const currency = extractCurrency($(".a-price-symbol"));

    const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");

    const description = extractDescription($);

    const rating = extractRating(
        $('.a-declarative span.a-icon-alt')
    );

    const reviewsCount = extractReviewsCount(
      $('#acrCustomerReviewText')
    );

    console.log("reviewsCount : ",reviewsCount);

    // construct data object with scraped information
    const data = {
      url,
      currency: currency || "₹" || "$",
      image: imageUrls[0],
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [],
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
      discountRate: Number(discountRate),
      reviewsCount,
      description,
      category: "category",
      stars: rating,
      isOutOfStock: outOfStock,
    };
    //console.log("data : ", data);
    return data;
  } catch (error: any) {
    console.log("Error in scraper configuration : ", error);
  }
}
