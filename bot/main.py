import subprocess
import webbrowser
import wikipediaapi

# Add more applications and their paths as needed
applications = {
    "notepad": "notepad.exe",
    "calculator": "calc.exe",
    "chrome": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "word": "C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE",
    "paint": "mspaint.exe",
    "excel": "C:\\Program Files\\Microsoft Office\\root\\Office16\\EXCEL.EXE",
    "jupyter": "jupyter lab",
    "powerbi": "PBIDesktopStore.exe",
}

# Add more websites and their URLs as needed
websites = {
    "wiki": "https://en.wikipedia.org/wiki/Main_Page",
    "youtube": "https://www.youtube.com/",
    "github": "https://github.com/Melvynwastaken",
    "wayback": "https://wayback-api.archive.org/",
    "gpt": "https://chat.openai.com/",
    "steam": "https://store.steampowered.com/",
    "discord": "https://discord.com/channels/@me",
    "spotify": "https://open.spotify.com",
}

# Function to open an application
def open_application(app_name):
    app_name = app_name.lower()
    if app_name in applications:
        try:
            subprocess.Popen(applications[app_name])
            return f"Opening {app_name}..."
        except Exception as e:
            return f"Failed to open {app_name}: {str(e)}"
    else:
        return f"{app_name} not found."

# Function to open a website
def open_web(web_name):
    web_name = web_name.lower()
    if web_name in websites:
        try:
            webbrowser.open(websites[web_name])
            return f"Opening {web_name}..."
        except Exception as e:
            return f"Failed to open {web_name}: {str(e)}"
    else:
        return f"{web_name} not found."

# Function to search on Wikipedia
def search_wikipedia(query):
    wiki = wikipediaapi.Wikipedia("en")
    page = wiki.page(query)
    if page.exists():
        return f"{page.title}\n\n{page.summary}"
    else:
        return "No Wikipedia page found for your query."

# Main function
if __name__ == "__main__":
    action = input("What would you like to do? (open application / open website / search wikipedia): ").strip().lower()

    if action == "open application":
        app_name = input("Enter the name of the application to open: ").strip()
        print(open_application(app_name))
    elif action == "open website":
        web_name = input("Enter the name of the website to open: ").strip()
        print(open_web(web_name))
    elif action == "search wikipedia":
        query = input("Enter your search query for Wikipedia: ").strip()
        print(search_wikipedia(query))
    else:
        print("Invalid action. Please choose from 'open application', 'open website', or 'search wikipedia'.")
