const capturarFala = () => {
    const botao = document.querySelector('#microfone');
    const input = document.querySelector('input');
    let audioAtivo = false;
    let mensagemEmAndamento = false;
    let recognition;

    const microfoneButton = document.getElementById("microfone");
    const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new speechRecognition();
    recognition.lang = window.navigator.language;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1][0].transcript.toLowerCase();
        input.value = result;

        if (result.includes("jarvis.")) {
            if (!audioAtivo && !mensagemEmAndamento) {
                iniciarCapturaAudio();
                mensagemEmAndamento = true;
            }
        } else if (result.includes("fim da mensagem")) {
            if (mensagemEmAndamento) {
                encerrarCapturaAudio();
                mensagemEmAndamento = false;
            }
        }
    };

    botao.addEventListener("click", () => {
        if (!audioAtivo && !mensagemEmAndamento) {
            iniciarCapturaAudio();
            mensagemEmAndamento = true;
        } else if (mensagemEmAndamento) {
            encerrarCapturaAudio();
            mensagemEmAndamento = false;
        }
    });

    const iniciarCapturaAudio = () => {
        recognition.start();
        audioAtivo = true;
        microfoneButton.classList.remove("com-audio");
        microfoneButton.classList.add("sem-audio");
    };

    const encerrarCapturaAudio = () => {
        recognition.stop();
        audioAtivo = false;
        microfoneButton.classList.remove("sem-audio");
        microfoneButton.classList.add("com-audio");
        perguntarJarvis(input.value);
    };
}

const perguntarJarvis = async (pergunta) => {
    let url = 'https://api.openai.com/v1/chat/completions';
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
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
    const subscriptionKey = 'a237503dffdb4a888c58c272a7294073';
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
            const audioUrl = URL.createObjectURL(data);
            const audioElement = new Audio(audioUrl);
            document.body.appendChild(audioElement);
            audioElement.play();
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

//capturarFala();


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