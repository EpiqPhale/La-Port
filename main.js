var gameEngine = new GameEngine();

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./sprites/greenportal.png");
ASSET_MANAGER.queueDownload("./sprites/purpleportal.png");
ASSET_MANAGER.queueDownload("./sprites/placeholder.png");
ASSET_MANAGER.queueDownload("./sprites/orb_anim_strip_6.png");
ASSET_MANAGER.queueDownload("./sprites/tileset.png");
ASSET_MANAGER.queueDownload("./sprites/checkpoint.png");
ASSET_MANAGER.queueDownload("./sprites/info.png");
ASSET_MANAGER.queueDownload("./sprites/coin.png");

ASSET_MANAGER.downloadAll(function () {
	var canvas = document.getElementById('gameWorld');
	var ctx = canvas.getContext('2d');
	PARAMS.CANVAS_WIDTH = canvas.width;
	PARAMS.BLOCKWIDTH = PARAMS.BITWIDTH * PARAMS.SCALE;

	gameEngine.init(ctx);
	ctx.imageSmoothingEnabled = false;

	new SceneManager(gameEngine);

	gameEngine.start();
});