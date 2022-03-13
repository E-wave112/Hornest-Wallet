export default (firstName: string, lastName: string, data: any) => {
  if (data) {
    const { Bitcoin, Ethereum, Dogecoin, Solana, Shiba } =
      data.data['exchange rates for popular coins'];

    return {
      price_alert: {
        subject: 'Daily price alert',
        html: `<div>Bitcoin: ${Bitcoin} Ethereum: ${Ethereum} Dogecoin: ${Dogecoin} Solana: ${Solana} Shiba: ${Shiba}</div>`,
      },
    };
  }

  return {
    welcome: {
      subject: 'Thanks for joining us Under the Stars!',
      html: `<div>Welcome, ${firstName} ${lastName}!. Thank you for joining "Hornest wallet". Please proceed to the app, and set up your online profile</div>`,
    },
  };
};
