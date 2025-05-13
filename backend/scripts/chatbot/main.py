
import sys
import io
from langchain.agents import initialize_agent, AgentType
from langchain_openai import ChatOpenAI
from tools.traffic_tool import traffic_duration_tool, traffic_street_tool,bus_terminus_tool,bus_route_tool
from tools.weather_tool import weather_tool
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Initialiser GPT-4
llm = ChatOpenAI(model="gpt-4", temperature=0)

# Déclarer les outils (trafic et météo)
tools = [traffic_street_tool, traffic_duration_tool, weather_tool,bus_terminus_tool,bus_route_tool]

# Créer l'agent avec les outils + GPT-4
agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    handle_parsing_errors=True,  # utile pour éviter les crash
    verbose=True
)

def extract_final_answer(response: str) -> str:
    """
    Fonction pour extraire uniquement la réponse finale de l'agent.
    """
    # Rechercher la section 'Final Answer:' et l'extraire
    if "Final Answer:" in response:
        start = response.index("Final Answer:") + len("Final Answer:")  # commencer après "Final Answer:"
        return response[start:].strip()
    return response.strip()

if __name__ == "__main__":
    print("🤖 Bienvenue ! Posez une question (trafic, météo ou autre). Tapez 'exit' pour quitter.")
    while True:
        query = input("🗣️ Vous: ")
        if query.lower() in ["exit", "quit"]:
            print("👋 À bientôt !")
            break
        try:
            response = agent.run(query)
            # Extraire uniquement la réponse finale
            final_answer = extract_final_answer(response)
        except Exception as e:
            final_answer = f"❌ Erreur : {str(e)}"

        print("🤖 Bot:", final_answer)
