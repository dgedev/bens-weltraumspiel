const config = {
    type: Phaser.AUTO,
    width: window.innerWidth, // Anpassung an die Bildschirmbreite
    height: window.innerHeight, // Anpassung an die Bildschirmhöhe
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        mode: Phaser.Scale.RESIZE, // Automatische Anpassung der Spielgröße
        autoCenter: Phaser.Scale.CENTER_BOTH // Zentriert das Spiel
    }
};

const game = new Phaser.Game(config);
let player;
let cursors;
let star;
let score = 0;
let scoreText;
let targetPosition = null;

function preload() {
    // Hintergrund- und Spielerbilder laden
    this.load.image('sky', 'assets/sky.jpg');
    this.load.image('ship', 'assets/ship.png');
    this.load.image('star', 'assets/star.png');
}

function create() {
    // Hintergrundbild hinzufügen
    this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'sky').setDisplaySize(window.innerWidth, window.innerHeight);

    // Spielerschiff hinzufügen und skalieren
    player = this.physics.add.sprite(window.innerWidth / 2, window.innerHeight - 100, 'ship').setScale(1.7);
    player.setCollideWorldBounds(true); // Verhindert, dass der Spieler aus dem Bildschirm geht

    // Stern hinzufügen
    star = this.physics.add.sprite(Phaser.Math.Between(50, window.innerWidth - 50), 0, 'star').setScale(1.2);
    star.setCollideWorldBounds(true);
    star.setBounce(1);
    star.setVelocity(0, 200);

    // Spieler und Stern Kollisions-Check
    this.physics.add.overlap(player, star, catchStar, null, this);

    // Eingabe-Events
    cursors = this.input.keyboard.createCursorKeys();

    // Punkteanzeige
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' }).setScrollFactor(0);

    // Touch-Eingaben hinzufügen
    this.input.on('pointerdown', function (pointer) {
        targetPosition = { x: pointer.x, y: pointer.y };
    }, this);
}

function update() {
    // Spielerbewegung - Tastatur
    if (cursors.left.isDown) {
        player.setVelocityX(-400);
    } else if (cursors.right.isDown) {
        player.setVelocityX(400);
    } else if (!targetPosition) {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-400);
    } else if (cursors.down.isDown) {
        player.setVelocityY(400);
    } else if (!targetPosition) {
        player.setVelocityY(0);
    }

    // Spielerbewegung - Touch
    if (targetPosition) {
        if (Phaser.Math.Distance.Between(player.x, player.y, targetPosition.x, targetPosition.y) < 5) {
            player.setVelocity(0);
            targetPosition = null;
        } else {
            this.physics.moveToObject(player, targetPosition, 400);
        }
    }

    // Wenn der Stern den Boden erreicht, zurücksetzen
    if (star.y > window.innerHeight) {
        resetStar();
    }
}

function catchStar(player, star) {
    // Stern "fangen"
    resetStar();

    // Punkte erhöhen
    score += 10;
    scoreText.setText('Score: ' + score);
}

function resetStar() {
    // Stern zurücksetzen
    star.setPosition(Phaser.Math.Between(50, window.innerWidth - 50), 0);
    star.setVelocity(0, 200);
}

// Event Listener, um das Spiel bei Größenänderungen des Fensters anzupassen
window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});
