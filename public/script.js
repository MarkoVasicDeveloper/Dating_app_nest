const orderId = document.querySelector('[data-orderId"]');
const username = document.querySelector('[data-username"]');
const email = document.querySelector('[data-email"]');
paypal.Buttons({
    createOrder: () => {
        return fetch('/pay-order', {
            method: 'Post',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                orderId,
                username,
                email
            })
        }).then(res => {
            if(res.ok) return res.json();
            return res.json().then(json => Promise.reject(json))
        }).then(({ id }) => { return id }).catch(e => console.log(e.error));
    },
    onApprove: (data, actions) => {
        return actions.order.capture().then(res => {
            console.log(res)
            alert("Transaction from" + res.payer.name.given_name);
        })
    }
}).render('#paypal');