window['ThemeComponent_Quantity'] = () => {
  return {
    quantity: 1,

    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }

      return liveRegion(this.quantity);
    },

    increaseQuantity() {
      this.quantity++;
      return liveRegion(this.quantity);
    }

  };
};
