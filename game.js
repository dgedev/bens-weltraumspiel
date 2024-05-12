// Konfiguration für das Spiel
const config = {
    type: Phaser.AUTO, // Phaser wählt automatisch die beste Render-Methode (Canvas oder WebGL)
    width: 800, // Breite des Spielbereichs
    height: 600, // Höhe des Spielbereichs
    physics: {
        default: 'arcade', // Arcade-Physiksystem verwenden
        arcade: {
            debug: false // Debugging für die Physik deaktivieren
        }
    },
    scene: {
        preload: preload, // Preload-Funktion für das Laden von Assets
        create: create, // Create-Funktion für das Erstellen von Objekten
        update: update // Update-Funktion für die Spielaktualisierung
    }
};

// Erstellung des Spielobjekts mit der obigen Konfiguration
const game = new Phaser.Game(config);
let player; // Variable für das Spielerschiff
let cursors; // Variable für die Tastatursteuerung
let star; // Variable für den Stern
let score = 0; // Variable für den Punktestand
let scoreText; // Variable für den Punktestand-Text

// Preload-Funktion zum Laden der benötigten Assets
function preload() {
    this.load.image('sky', 'assets/sky.jpg'); // Hintergrundbild laden
    this.load.image('ship', 'assets/ship.png'); // Bild des Spielerschiffs laden
    this.load.image('star', 'assets/star.png'); // Bild des Sterns laden
}

// Create-Funktion zum Erstellen der Spielobjekte und der grundlegenden Einstellungen
function create() {
    this.add.image(400, 300, 'sky'); // Hintergrundbild in der Mitte des Spielbereichs hinzufügen

    // Spielerschiff hinzufügen und auf 100% skalieren
    player = this.physics.add.sprite(400, 550, 'ship').setScale(1.0);
    player.setCollideWorldBounds(true); // Verhindert, dass der Spieler aus dem Bildschirm geht

    // Stern hinzufügen, zufällig positionieren, skalieren und Geschwindigkeit setzen
    star = this.physics.add.sprite(Phaser.Math.Between(50, 750), 0, 'star').setScale(0.3);
    star.setCollideWorldBounds(true); // Stern bleibt im Spielbereich
    star.setBounce(1); // Stern prallt ab
    star.setVelocity(0, 500); // Stern fällt mit einer Geschwindigkeit von 500 nach unten

    // Überprüfung der Überlappung zwischen Spieler und Stern, um Stern zu "fangen"
    this.physics.add.overlap(player, star, catchStar, null, this);

    // Tastatursteuerung initialisieren
    cursors = this.input.keyboard.createCursorKeys();

    // Punkteanzeige erstellen
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' });
}

// Update-Funktion, die in jedem Frame aufgerufen wird, um das Spiel zu aktualisieren
function update() {
    // Spielerbewegung basierend auf den Pfeiltasten
    if (cursors.left.isDown) {
        player.setVelocityX(-400); // Bewegung nach links
    } else if (cursors.right.isDown) {
        player.setVelocityX(400); // Bewegung nach rechts
    } else {
        player.setVelocityX(0); // Keine horizontale Bewegung
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-400); // Bewegung nach oben
    } else if (cursors.down.isDown){
        player.setVelocityY(400); // Bewegung nach unten
    } else {
        player.setVelocityY(0); // Keine vertikale Bewegung
    }

    // Überprüfen, ob der Stern den Boden erreicht hat
    if (star.y > 600) {
        resetStar(); // Stern zurücksetzen, wenn er den Boden erreicht
    }
}

// Funktion, die aufgerufen wird, wenn der Spieler den Stern "fängt"
function catchStar(player, star) {
    resetStar(); // Stern zurücksetzen

    // Punktestand erhöhen
    score += 10;
    scoreText.setText('Score: ' + score); // Aktualisieren der Punkteanzeige
}

// Funktion zum Zurücksetzen des Sterns
function resetStar() {
    // Stern an eine zufällige Position oben setzen und Geschwindigkeit nach unten setzen
    star.setPosition(Phaser.Math.Between(50, 750), 0);
    star.setVelocity(0, 500);
}
