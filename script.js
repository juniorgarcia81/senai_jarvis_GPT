//
const apikey = process.env.OPENAI_API_KEY;
const Azurekey = process.env.AZURE_API_KEY;

const capturarFala = () => {
    let botao = document.querySelector('#microfone');
    let input = document.querySelector('input');

    const microfoneButton = document.getElementById("microfone");

    const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new speechRecognition();
    recognition.lang = window.navigator.language;
    recognition.interimResults = true;

    botao.addEventListener("mousedown", () => {
        recognition.start();
        microfoneButton.classList.remove("com-audio");
        microfoneButton.classList.add("sem-audio");
    });

    botao.addEventListener("mouseup", () => {
        recognition.stop();
        microfoneButton.classList.remove("sem-audio");
        microfoneButton.classList.add("com-audio");
        perguntarJarvis(input.value);
        console.log(input.value);
    });

    recognition.addEventListener('result', (e) => {
        const result = e.results[e.results.length - 1][0].transcript;
        input.value = result;
        //console.log(result);
    })

}

//jarvis-gpt-garcia
//https://brazilsouth.api.cognitive.microsoft.com/sts/v1.0/issuetoken
//a237503dffdb4a888c58c272a7294073

const perguntarJarvis = async (pergunta) => {

    let url = 'https://api.openai.com/v1/chat/completions';
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apikey}`
    };

    let body = {
        "model": "ft:gpt-3.5-turbo-0613:zeros-e-um::8DDHyrh4",
        "messages": [
            {
                "role": "system",
                "content": "Jarvis é um chatbot pontual e muito simpático que ajuda as pessoas"
            },
            {
                "role": "user",
                "content": pergunta
            }
        ],
        "temperature": 0.7
    };

    let options = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    };


    fetch(url, options)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            let texto = data.choices[0].message.content;
            respostaJarvis(texto);
        });



}

const respostaJarvis = async (resposta) => {
    const url = 'https://brazilsouth.tts.speech.microsoft.com/cognitiveservices/v1';
    const subscriptionKey = Azurekey;
    const ssmlContent = `   <speak version='1.0' xml:lang='en-US'>
                                <voice xml:lang='pt-br' xml:gender='Male' name='pt-br-BrendaNeural'>
                                ${resposta}
                                    </voice> 
                            </speak>`;

    const headers = {
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
        'User-Agent': 'curl'
    };

    const fetchData = {
        method: 'POST',
        headers: headers,
        body: ssmlContent,
    };

    fetch(url, fetchData)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.blob();
        })
        .then(data => {
            // O conteúdo da resposta está em 'data'. Você pode fazer o que desejar com ele.
            console.log(data);
            const audioUrl = URL.createObjectURL(data);
            const audioElement = new Audio(audioUrl);
            document.body.appendChild(audioElement);
            audioElement.play();
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}
//capturarFala()



const AtivarJarvis = () => {

    // Crie uma instância de SpeechRecognition
    const recognition = new webkitSpeechRecognition();

    // Defina configurações para a instância
    recognition.continuous = true; // Permite que ele continue escutando
    recognition.interimResults = false; // Define para true se quiser resultados parciais

    // Inicie o reconhecimento de voz
    recognition.start();

    // Adicione um evento de escuta para lidar com os resultados
    recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1]; // Último resultado

        // Verifique o texto reconhecido
        const recognizedText = result[0].transcript;

        // Verifique se a palavra "Jarvis" está no texto
        if (recognizedText.toLowerCase().includes('jarvis')) {

            // Comece a salvar a pergunta quando "Jarvis" é detectado
            let array_pergunta = recognizedText.toLowerCase().split('jarvis');
            array_pergunta = array_pergunta[array_pergunta.length - 1];

            input.value = array_pergunta;
            perguntarJarvis(array_pergunta);

            // Pare o reconhecimento de voz para economizar recursos
            recognition.stop();
        }
    };

    // Adicione um evento para reiniciar o reconhecimento após um tempo
    recognition.onend = () => {
        setTimeout(() => {
            recognition.start();
        }, 1000); // Espere 1 segundo antes de reiniciar
    };


}
AtivarJarvis()

const modoDarkButton = document.getElementById("modoDarkButton");
const body = document.body;
const lateral = document.querySelector(".lateral");
const input = document.querySelector("input");

modoDarkButton.addEventListener("click", () => {
    if (body.classList.contains("dark-mode")) {
        body.classList.remove("dark-mode");
        lateral.classList.remove("dark-mode");
        input.classList.remove("dark-mode");
    } else {
        body.classList.add("dark-mode");
        lateral.classList.add("dark-mode");
        input.classList.add("dark-mode");
    }
});

