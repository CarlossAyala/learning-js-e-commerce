import SellerClient from '../../api';

const ENDPOINT = 'account';

const API = {
  async signup(values) {
    const { data } = await SellerClient.request({
      method: 'POST',
      url: `/${ENDPOINT}/signup`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: values,
    });

    return data;
  },
};

export default API;
