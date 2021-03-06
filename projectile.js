class Projectile {
    constructor(game, x, y, xDestination,yDestination, color){
        Object.assign(this, {game, x, y, xDestination,yDestination, color});
        this.updateBB();
        this.game.projectile = this;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/projectiles.png"); //add sprite
        if(this.color === "green"){
            this.animation = new Animator(this.spritesheet,0,11,21,10,2,.2,0,false,true); //135x 120y

        } else if (this.color === "purple") {
            this.animation = new Animator(this.spritesheet,0,0,21,10,2,.2,0,false,true); //135x 120y
        } else {
            console.log("invalid color entered for portal");
        }

        this.deltax = (xDestination-x);
        this.deltay= (yDestination-y);
        console.log(this.deltay);
        this.slope = this.deltay/this.deltax;
        this.reflectSound = AUDIO_MANAGER.getAsset("./audio/reflect.wav");
        this.bounceCount = 0;
        this.angle = this.getAngle(this.deltax, this.deltay);
        console.log(this.angle);
    };

    getAngle(dx, dy){
        if(dy > 0) return (Math.atan(dx/dy) + (3*Math.PI/2));
        return Math.atan(dx/dy) + (Math.PI/2);
    };

    updateBB(){
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x,this.y,32*0.8,16*0.8)
    }

    update() {
        const PROJECTILE_SPEED = 950*this.game.clockTick;
        //console.log(PROJECTILE_SPEED)
        let degree = Math.atan(this.slope);
        if(this.deltax>0){
            this.x += PROJECTILE_SPEED*Math.cos(degree);
            this.y += PROJECTILE_SPEED*Math.sin(degree);
        } else {
            this.x -= PROJECTILE_SPEED*Math.cos(degree);
            this.y -= PROJECTILE_SPEED*Math.sin(degree);
        }

        let that = this;
        this.game.entities.forEach(function(entity){
            if(entity.BB && that.BB.collide(entity.BB)){
                if(that.lastBB && entity instanceof Brick) {
                    if(entity instanceof GlassBrick){} //do nothing
                    else if(entity instanceof PortProofBrick){
                        that.removeFromWorld = true;
                    }
                    else if(entity instanceof MirrorBrick){
                        that.bounceCount++;
                        that.reflectSound.play();
                        if(that.lastBB.left >= entity.BB.right || that.lastBB.right <= entity.BB.left){
                        that.deltax = -1*that.deltax;
                        that.slope = -1*that.slope;

                        } else{
                            that.slope = -1*that.slope;
                        }
                        that.x = that.lastBB.x;
                        that.y = that.lastBB.y;

                        that.angle = that.getAngle(that.deltax, that.deltax*that.slope);
                    }
                    else if(entity.top && that.lastBB.bottom <= entity.BB.top){
                        if (that.color==="purple" && that.game.purplePortal) {
                            if (that.game.purplePortal.openingCounter >= .25) that.game.addEntity(new DyingPortal(that.game,that.game.purplePortal.x,that.game.purplePortal.y,"purple",that.game.purplePortal.orientation))
                            that.game.purplePortal.removeFromWorld = true;
                        } //if there is already a purple portal then destroy the old one
                        else if (that.color === "green" && that.game.greenPortal) {
                            if (that.game.greenPortal.openingCounter >= .25) that.game.addEntity(new DyingPortal(that.game,that.game.greenPortal.x,that.game.greenPortal.y,"green",that.game.greenPortal.orientation))
                            that.game.greenPortal.removeFromWorld = true;
                        } //if there is already a green portal then destroy the old one
                        that.game.addEntity(new Portal(that.game,entity.BB.left+15,entity.BB.top-PARAMS.PORTAL_ANIM_OFFSET,that.color, "top"));
                        that.removeFromWorld = true;
                    }
                    else if(entity.bottom && that.lastBB.top >= entity.BB.bottom){
                        if (that.color==="purple" && that.game.purplePortal) {
                            if (that.game.purplePortal.openingCounter >= .25) that.game.addEntity(new DyingPortal(that.game,that.game.purplePortal.x,that.game.purplePortal.y,"purple",that.game.purplePortal.orientation))
                            that.game.purplePortal.removeFromWorld = true;
                        } //if there is already a purple portal then destroy the old one
                        else if (that.color === "green" && that.game.greenPortal) {
                            if (that.game.greenPortal.openingCounter >= .25) that.game.addEntity(new DyingPortal(that.game,that.game.greenPortal.x,that.game.greenPortal.y,"green",that.game.greenPortal.orientation))
                            that.game.greenPortal.removeFromWorld = true;
                        } //if there is already a green portal then destroy the old one
                        that.game.addEntity(new Portal(that.game,entity.BB.left+15,entity.BB.bottom-PARAMS.PORTAL_ANIM_OFFSET,that.color,"bottom"));
                        that.removeFromWorld = true;
                    }
                    else if(entity.right && that.lastBB.left >= entity.BB.right){
                        if (that.color==="purple" && that.game.purplePortal) {
                            if (that.game.purplePortal.openingCounter >= .25) that.game.addEntity(new DyingPortal(that.game,that.game.purplePortal.x,that.game.purplePortal.y,"purple",that.game.purplePortal.orientation))
                            that.game.purplePortal.removeFromWorld = true;
                        } //if there is already a purple portal then destroy the old one
                        else if (that.color === "green" && that.game.greenPortal) {
                            if (that.game.greenPortal.openingCounter >= .25) that.game.addEntity(new DyingPortal(that.game,that.game.greenPortal.x,that.game.greenPortal.y,"green",that.game.greenPortal.orientation))
                            that.game.greenPortal.removeFromWorld = true;
                        } //if there is already a green portal then destroy the old one
                        that.game.addEntity(new Portal(that.game,entity.BB.right-PARAMS.PORTAL_ANIM_OFFSET,entity.BB.top+15,that.color,"right"));
                        that.removeFromWorld = true;
                    }
                    else if((entity.left && that.lastBB.right <= entity.BB.left) || (that.BB.top >= entity.BB.top && that.BB.bottom <= entity.BB.bottom)){
                        if(entity.left){
                            if (that.color==="purple" && that.game.purplePortal) {
                                if (that.game.purplePortal.openingCounter >= .25) that.game.addEntity(new DyingPortal(that.game,that.game.purplePortal.x,that.game.purplePortal.y,"purple",that.game.purplePortal.orientation))
                                that.game.purplePortal.removeFromWorld = true;
                            } //if there is already a purple portal then destroy the old one
                            else if (that.color === "green" && that.game.greenPortal) {
                                if (that.game.greenPortal.openingCounter >= .25) that.game.addEntity(new DyingPortal(that.game,that.game.greenPortal.x,that.game.greenPortal.y,"green",that.game.greenPortal.orientation))
                                that.game.greenPortal.removeFromWorld = true;
                            } //if there is already a green portal then destroy the old one
                            that.game.addEntity(new Portal(that.game,entity.BB.left-PARAMS.PORTAL_ANIM_OFFSET,entity.BB.top+15,that.color,"left"));
                        }
                        that.removeFromWorld = true;
                    }
                    
                }
                if(that.lastBB && entity instanceof Door) {
                    if(entity.state != 3) that.removeFromWorld = true;
                }
            }
        });
        if(this.bounceCount >= 30) this.removeFromWorld = true;
        this.updateBB()


    };

    drawRotated(angle, ctx){
        ctx.save();
        var offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = 26;
        offscreenCanvas.height = 26;
        var offscreenCtx = offscreenCanvas.getContext('2d');
        offscreenCtx.save();
        offscreenCtx.translate(13,13);
        offscreenCtx.rotate(-1*angle);
        offscreenCtx.translate(-13, -13);

        this.animation.drawFrame(this.game.clockTick,offscreenCtx,0,0,1);
        offscreenCtx.restore();

        ctx.drawImage(offscreenCanvas, this.x- this.game.camera.x, this.y, 33, 33);
    };

    draw(ctx) {
        //this.animation.drawFrame(this.game.clockTick,ctx,0,0,4);
        //this.animation.drawFrame(this.game.clockTick,ctx,this.x- this.game.camera.x,this.y,1);
        this.drawRotated(this.angle, ctx);
        if (PARAMS.DEBUG){
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y, this.BB.width, this.BB.height);
        }
    };
};