// Define a Chatbox class
class Chatbox {
    constructor() {
        // Define properties for the Chatbox
        this.args = {
            openButton: document.querySelector('.chatbox__button'), // Selects the button to open the chatbox
            chatBox: document.querySelector('.chatbox__support'), // Selects the chatbox itself
            sendButton: document.querySelector('.send__button') // Selects the button to send messages
        }

        this.state = false; // Indicates the current state of the chatbox (open/closed)
        this.messages = []; // Array to store messages
    }

    // Function to display the chatbox
    display() {
        const {openButton, chatBox, sendButton} = this.args;


        // Event listener for clicking the open button to toggle chatbox visibility
        openButton.addEventListener('click', () => this.toggleState(chatBox))

        // Event listener for clicking the send button to send messages
        sendButton.addEventListener('click', () => this.onSendButton(chatBox))

        // Event listener for pressing Enter key to send messages
        const node = chatBox.querySelector('input');

        node.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        });

        const initialQuestionButtons = document.querySelectorAll('.chatbot__initial_questions');
        initialQuestionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const message = button.getAttribute('data-message');
                this.sendMessage(chatBox, message);
            });
        });
    }

    // Function to toggle the chatbox state (show/hide)
    toggleState(chatbox) {
        this.state = !this.state;

        // Show or hide the chatbox based on the state
        if(this.state) {
            chatbox.classList.add('chatbox--active') // Shows the chatbox
        } else {
            chatbox.classList.remove('chatbox--active') // Hides the chatbox
        }
    }

    // Function to handle sending messages
    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value
        if (text1 === "") {
            return; // If the message is empty, do nothing
        }

        // Create a message object from the user's input
        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1); // Add the user's message to the message array

        // Send a request to a local server for message processing
        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(r => r.json())
          .then(r => {
            // Create a message object with the response from the server
            let msg2 = { name: "Sam", message: r.answer };
            this.messages.push(msg2); // Add the server's response to the message array
            this.updateChatText(chatbox) // Update the chatbox display with the new messages
            textField.value = '' // Clear the input field after sending the message

        }).catch((error) => {
            console.error('Error:', error); // Log any errors that occur
            this.updateChatText(chatbox) // Update the chatbox display even if an error occurs
            textField.value = '' // Clear the input field after sending the message
          });
    }

    sendMessage(chatbox, text) {
        const msg = { name: "User", message: text };
        this.messages.push(msg);

        this.updateChatText(chatbox);
    }


    // Function to update the chatbox display with messages
    updateChatText(chatbox) {
        var html = '';
        // Iterate through the messages array and create HTML elements for each message
        this.messages.slice().reverse().forEach(function(item, index) {
            if (item.name === "Sam") {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            } else {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            }
          });

        const chatmessage = chatbox.querySelector('.chatbox__messages'); // Select the element to display messages
        chatmessage.innerHTML = html; // Update the inner HTML with the new messages
    }
}

// Create an instance of the Chatbox class and display it
const chatbox = new Chatbox();
chatbox.display();

