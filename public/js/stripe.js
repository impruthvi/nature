/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe(
  'pk_test_51M5Tn5SJ4MdoNNIj8ZHpRtARTMGORKB3bxaaMjsqCPJv0MS9IroluBsAPGjuD8RO8Iq8pOjJ2R2pckfTuf9f2vvZ00kAfZ9ku9'
);
export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios({
      url: `/api/v1/bookings/checkout-session/${tourId}`
    });
    // console.log(session.data.session.id);
    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
        sessionId: session.data.session.id
    });
  } catch (err) {
    // console.log(err);
    showAlert('error', err);
  }
};
