import Stripe from "stripe";
import expressAsync from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
let stripe = new Stripe(process.env.Stripe_Secret);
export let Payment = expressAsync(async (req, res, next) => {
  let { products } = req.body;
  let line_items = products.map(product => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: product.title,
          description: product.desc,
        },
        unit_amount: product.price * 100,
      },
      quantity: product.quantity,
    };
  })
  try {
    let session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: "https://simple-eco-front.vercel.app/success",
      cancel_url: "https://simple-eco-front.vercel.app",
    });
    res.send({url : session.url});
  } catch (error) {
    next(error);
  }
});
