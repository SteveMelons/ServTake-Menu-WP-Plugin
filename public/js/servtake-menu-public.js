(function ($) {
  "use strict";

  /**
   * All of the code for your public-facing JavaScript source
   * should reside in this file.
   *
   * Note: It has been assumed you will write jQuery code here, so the
   * $ function reference has been prepared for usage within the scope
   * of this function.
   *
   * This enables you to define handlers, for when the DOM is ready:
   *
   * $(function() {
   *
   * });
   *
   * When the window is loaded:
   *
   * $( window ).load(function() {
   *
   * });
   *
   * ...and/or other possibilities.
   *
   * Ideally, it is not considered best practise to attach more than a
   * single DOM-ready or window-load handler for a particular page.
   * Although scripts in the WordPress core, Plugins and Themes may be
   * practising this, we should strive to set a better example in our own work.
   */

  // menu item JSON format (many place in one array)
  /* 
    {
    category: "Starters",
    name: 'Chicken Salad',
    price: 12.89,
    description: {
      main: 'A mixed salad with chicken.',
      lists: [
      {
        name: 'Additives',
        content: [
        'Preservatives'
        ]
      },
      {
        name: 'Allergens',
        content: [
        'Egg',
        'Soy',
        'Mustard',
        'Sulfur'
        ]
      }
      ]
    }
    }
  */

  $(document).ready(function () {
    (() => {
      let container = $("#menu-container"); // main container
      let menu = $('<div class="menu"></div>'); // menu container
      let cart = $(
        '<div id="cart-container" class="cart-container"><div class="cart-content"><div class="head-container"><h4 class="name">Bestellung</h4><i class="far fa-times-circle close"></i></div><div id="cart-items" class="items-container"></div><div class="order-container"><span id="order-button" class="order-button"><i class="fab fa-whatsapp"></i> Jetzt über WhatsApp bestellen</span></div></div></div>'
      ); // cart container
      let cartButton = $(
        '<div class="cart-button"><i class="fab fa-whatsapp"></i>Bestellung<span id="total-cart" class="number">0.00 €</div>'
      ); // cart container
      let finalOrder = $(
        '<div id="final-order-container" class="cart-container"><div class="cart-content"><div class="head-container"><h4 class="name">Ihre Daten</h4><i class="far fa-times-circle close"></i></div><div class="items-container"><textarea placeholder="Name" id="name-input"></textarea><textarea placeholder="Adresse" id="address-input"></textarea></div><div class="order-container"><span id="final-order-button" class="order-button"><i class="fab fa-whatsapp"></i> Jetzt über WhatsApp bestellen</span></div></div></div>'
      );

      container.append(menu); // add menu and cart divs to container
      $("body").append(cartButton, cart, finalOrder);

      let data = JSON.parse(menuJSONData);

      let phoneNumber = data.phone;
      let itemData = data.items;
      let restaurantName = data.restaurantName;

      // add each menu item to menu container
      itemData.forEach((menuItem, index) => {
        if (menuItem.description) {
          // add info box
          let description = `<div class="info-container" id="info-box-${index}"><div class="info-content"><div class="name-container"><h5 class="name">Info</h5><i class="far fa-times-circle close"></i></div><hr><p>${menuItem.description.main}</p>`;
          menuItem.description.lists.forEach((list) => {
            description += `<h6 class="list-name">${list.name}</h6><ul class="list">`;
            list.content.forEach((listItem) => {
              description += `<li class="list-item">${listItem}</li>`;
            });
            description += "</ul>";
          });
          description += "</div></div>";

          $("body").append($(description));
        }

        if (index > 0) {
          menu.append("<hr>");
        }

        // add category header if needed
        if (menuItem.category) {
          menu.append(`<h3 class="category-header">${menuItem.category}</h3>`);
        }

        if (menuItem.description) {
          // add menu item
          menu.append(
            `<div class="menu-item"><span class="menu-number">${
              menuItem.number
            }</span><div class="menu-content"><h4 class="name">${
              menuItem.name
            }</h4><span class="info" id="info-button-${index}">Info</span><span class="price">${menuItem.price.toFixed(
              2
            )} €</span></div><i id="add-button-${index}" class="far fa-plus-square menu-add"></i></div>`
          );
        } else {
          menu.append(
            `<div class="menu-item"><span class="menu-number">${
              menuItem.number
            }</span><div class="menu-content"><h4 class="name">${
              menuItem.name
            }</h4><span class="price">${menuItem.price.toFixed(
              2
            )} €</span></div><i id="add-button-${index}" class="far fa-plus-square menu-add"></i></div>`
          );
        }
      });

      // click handler to display info box
      let infoButtons = $(".menu-content .info");
      infoButtons.on("click", (event) => {
        let id = event.target.id.replace("info-button-", "");

        $(`#info-box-${id}`).show();
        $("body").addClass("no-scroll");
      });

      // click handler to hide info box
      let infoBoxes = $(".info-container");
      infoBoxes.on("click", (event) => {
        if (
          $(event.target).hasClass("info-container") ||
          $(event.target).hasClass("close")
        ) {
          infoBoxes.hide();
          $("body").removeClass("no-scroll");
        }
      });

      /* cart setup */
      let cartContent = [];
      /* 
      [
        {
        id: 0,
        name: 'salad',
        number: 'T4',
        price: 12.32,
        amount: 3,
        note: 'Extra sauce please'
        }
      ]
      */

      // cart setup
      const updateCart = () => {
        // calculate total
        let total = 0;
        cartContent.forEach((element) => {
          total += element.price * element.amount;
        });
        total = Math.round((total + Number.EPSILON) * 100) / 100;
        totalCart.text(total.toFixed(2) + " €");

        //draw cart content
        let totalHtmlString = `<div class="total-container"><span class="text">Gesamt</span><span class="total">${total.toFixed(
          2
        )} €</span></div>`;

        cartItemsContainer.empty();

        cartContent.forEach((element, index) => {
          let noteInput = $(
            `<textarea placeholder="Notiz" id="cart-item-input-${index}" class="input-field"></textarea>`
          );
          let noteText = $(`<span class="input-text"></span>`);
          let editButton = $(
            `<i id="cart-item-edit-${index}" class="far fa-edit"></i>`
          );
          let removeButton = $(
            `<i id="cart-item-remove-${index}" class="far fa-trash-alt"></i>`
          );
          let minusButton = $(
            `<i id="cart-item-minus-${index}" class="far fa-minus-square"></i>`
          );
          let plusButton = $(
            `<i id="cart-item-plus-${index}" class="far fa-plus-square"></i>`
          );

          // update value for input fields
          noteText.html(element.note);
          noteInput.val(element.note);

          // click handler for menu items in cart
          noteInput.on("input", () => {
            let val = noteInput.val();
            noteText.html(val);
            element.note = val;
          });

          editButton.on("click", () => {
            noteText.toggle();
            noteInput.toggle();
          });

          removeButton.on("click", (event) => {
            let id = event.target.id.split("-").pop();

            cartContent.splice(id, 1);
            updateCart();
          });

          minusButton.on("click", (event) => {
            let id = event.target.id.split("-").pop();

            if (cartContent[id].amount == 1) {
              cartContent.splice(id, 1);
            } else {
              cartContent[id].amount--;
            }
            updateCart();
          });

          plusButton.on("click", (event) => {
            let id = event.target.id.split("-").pop();

            cartContent[id].amount++;
            updateCart();
          });

          let itemHtmlString = `<div class="item"><div class="top-row"><span class="number">${
            element.number
          }</span><span class="name">${
            element.name
          }</span><span class="price">${
            element.amount
          }&times ${element.price.toFixed(2)} €<br>${(
            Math.round(
              (element.amount * element.price + Number.EPSILON) * 100
            ) / 100
          ).toFixed(2)} €</span></div><div class="bottom-row"></div></div><hr>`;
          cartItemsContainer.append(itemHtmlString);
          $(".bottom-row")
            .eq(index)
            .append(
              noteInput,
              noteText,
              editButton,
              removeButton,
              minusButton,
              plusButton
            );
        });

        cartItemsContainer.append(totalHtmlString);
      };

      let totalCart = $("#total-cart");
      let cartItemsContainer = $("#cart-items");
      updateCart();

      // click handler for add buttons
      let addButtons = $(".menu-add");
      addButtons.on("click", (event) => {
        let id = event.target.id.replace("add-button-", "");

        let index = cartContent.findIndex((element) => element.id == id);

        if (index != -1) {
          cartContent[index].amount++;
        } else {
          cartContent.push({
            id: id,
            name: itemData[id].name,
            number: itemData[id].number,
            price: itemData[id].price,
            amount: 1,
            note: "",
          });
        }

        updateCart();
      });

      // click handler to display cart
      let cartContainer = $("#cart-container");
      cartButton.on("click", () => {
        cartContainer.show();
        $("body").addClass("no-scroll");
      });

      // click handler to hide cart
      cartContainer.on("click", (event) => {
        if (
          $(event.target).hasClass("cart-container") ||
          $(event.target).hasClass("close")
        ) {
          cartContainer.hide();
          $("body").removeClass("no-scroll");
        }
      });

      let orderButton = $("#order-button");
      let finalOrderButton = $("#final-order-button");
      let finalOrderContainer = $("#final-order-container");
      let nameInput = $("#name-input");
      let addressInput = $("#address-input");

      // click handler to show final order
      orderButton.on("click", () => {
        cartContainer.hide();
        finalOrderContainer.show();
      });

      // click handler to hide final order
      finalOrderContainer.on("click", (event) => {
        if (
          $(event.target).hasClass("cart-container") ||
          $(event.target).hasClass("close")
        ) {
          finalOrderContainer.hide();
          $("body").removeClass("no-scroll");
        }
      });

      finalOrderButton.on("click", () => {
        let message = "*Bestellung*:\n\n----------------\n";
        let total = 0;

        cartContent.forEach((item) => {
          message += `${item.amount}x ${item.number} ${
            item.name
          } ${item.price.toFixed(2)} €\n`;
          if (item.note) {
            message += `Notiz: ${item.note}\n`;
          }
          message += "----------------\n";

          total += item.price * item.amount;
        });

        total = Math.round((total + Number.EPSILON) * 100) / 100;
        message += `\n*Gesamt*: ${total.toFixed(2)} €\n\n`;
        message += `Name: ${nameInput.val()}\n`;
        message += `Adresse: ${addressInput.val()}\n`;

        let order = {
          restaurant: restaurantName,
          time: new Date(Date.now()),
          items: cartContent,
          total,
        };

        message = encodeURIComponent(message);
        console.log(order);
        $.post(
          "http://localhost:3000/api/servtake-menu/order",
          order,
          "application/json"
        );

        window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
      });
    })();
  });
})(jQuery);
