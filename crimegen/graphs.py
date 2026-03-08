# graphs.py
import networkx as nx
import matplotlib.pyplot as plt
from matplotlib.backends.backend_qtagg import FigureCanvasQTAgg as FigureCanvas
from PyQt6.QtWidgets import QMainWindow, QWidget, QHBoxLayout, QApplication
from PyQt6.QtCore import QTimer
import random

class AsyncGraphWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Graphes Dynamiques avec Terminal")

        # --- Définir la taille et position selon l'écran ---
        screen = QApplication.primaryScreen()  # récupère l'écran principal
        screen_size = screen.availableGeometry()
        screen_width = screen_size.width()
        screen_height = screen_size.height()

        window_width = int(screen_width * 2 / 3)  # 2/3 de la largeur
        window_height = screen_height            # hauteur complète

        self.setGeometry(0, 0, window_width, window_height)  # x=0 pour aligner à gauche
        # self.setGeometry(100, 100, 1200, 600)

        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        layout = QHBoxLayout()
        central_widget.setLayout(layout)

        # === Graph relationnel ===
        self.fig_left, self.ax_left = plt.subplots()
        self.canvas_left = FigureCanvas(self.fig_left)
        layout.addWidget(self.canvas_left)
        self.G = nx.DiGraph()
        self.init_relation_graph()

        # === Frise chronologique ===
        self.fig_right, self.ax_right = plt.subplots()
        self.canvas_right = FigureCanvas(self.fig_right)
        layout.addWidget(self.canvas_right)
        self.timeline_events = [(1,"Naissance"),(3,"École"),(5,"Voyage")]
        self.init_timeline()

        # === Timer pour rafraîchissement automatique ===
        self.timer = QTimer()
        self.timer.timeout.connect(self.refresh_all)
        self.timer.start(1000)

    # ----- Initialisation -----
    def init_relation_graph(self):
        self.G.add_edges_from([("Alice","Bob"),("Bob","Charlie"),("Alice","Eve")])
        self.refresh_graph_terminal()
        self.draw_relation_graph()

    def init_timeline(self):
        self.refresh_timeline_terminal()
        self.draw_timeline()

    # ----- Méthodes d'affichage graphique -----
    def draw_relation_graph(self):
        self.ax_left.clear()
        pos = nx.spring_layout(self.G)
        nx.draw(self.G, pos, ax=self.ax_left, with_labels=True, node_color='lightblue', arrows=True)
        self.canvas_left.draw()

    def draw_timeline(self):
        self.ax_right.clear()
        for x,label in self.timeline_events:
            self.ax_right.scatter(x,0,s=200,c='orange')
            self.ax_right.text(x,0.1,label,ha='center')
        for i in range(len(self.timeline_events)-1):
            self.ax_right.annotate("", xy=(self.timeline_events[i+1][0],0),
                                   xytext=(self.timeline_events[i][0],0),
                                   arrowprops=dict(arrowstyle="->", color='black'))
        self.ax_right.set_ylim(-1,1)
        self.ax_right.axis('off')
        self.canvas_right.draw()

    # ----- Méthodes d'affichage terminal -----
    def refresh_graph_terminal(self):
        print("\n[Graph Relationnel]")
        if self.G.nodes:
            for node in self.G.nodes:
                successors = list(self.G.successors(node))
                print(f"{node} -> {successors}")
        else:
            print("Aucun nœud pour l'instant.")

    def refresh_timeline_terminal(self):
        print("\n[Timeline]")
        if self.timeline_events:
            for t,label in self.timeline_events:
                print(f"t={t} : {label}")
        else:
            print("Aucun événement pour l'instant.")

    # ----- Méthode centrale de rafraîchissement -----
    def refresh_all(self):
        """
        Méthode unique qui met à jour :
        - Graph relationnel (ajout aléatoire)
        - Timeline (ajout aléatoire)
        - Affichage graphique
        - Affichage terminal
        """
        # --- Graph relationnel ---
        """
        if random.random() < 0.3:  # 30% de chance
            new_node = f"Node{len(self.G.nodes)+1}"
            existing_node = random.choice(list(self.G.nodes)) if self.G.nodes else new_node
            self.G.add_edge(existing_node, new_node)
            print(f"[Relation] Ajout de {existing_node} -> {new_node}")
        """

        # self.draw_relation_graph()
        # self.refresh_graph_terminal()

        # --- Timeline ---
        """
        if random.random() < 0.2:  # 20% de chance
            x = self.timeline_events[-1][0] + random.randint(1,3)
            label = f"Event{len(self.timeline_events)+1}"
            self.timeline_events.append((x,label))
            print(f"[Timeline] Ajout de {label} à t={x}")

        """
        # self.draw_timeline()
        # self.refresh_timeline_terminal()
