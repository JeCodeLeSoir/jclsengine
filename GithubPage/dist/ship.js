import * as jcls from "jclsengine";
import HealPointBar from "./healPointBar.js";
import Tags from "./tags.js";
export default class Ship extends jcls.Behavior {
    static instance;
    Tag = Tags.Player;
    IsPhysics = true;
    DisplayOrder = 2;
    //image: HTMLImageElement;
    height = 60;
    width = 60;
    _spriteRenderer = null;
    _sprite = null;
    camera;
    speed;
    cooldown = 0;
    cooldownMax = 0.5;
    score = 0;
    life = 3;
    _clipExplosion = new jcls.Clip();
    _clipInpact = new jcls.Clip();
    _soundEffect = new jcls.SoundEffect();
    constructor() {
        super();
        //this.position.x = 25;
        //this.position.y = jcls.Behavior_Instance.SCREEN_HEIGHT / 2;
        this.position = new jcls.Vector2(0, 0);
        this.rotation = 0;
        this.speed = 150;
        //this.image = new Image();
        Ship.instance = this;
        console.log("Ship created");
        this.camera = jcls.Camera.mainCamera;
        //this.Instantiate(new Missile(), this);
    }
    Load() {
        this._spriteRenderer = new jcls.SpriteRenderer();
        this._sprite = new jcls.Sprite();
        this._sprite.LoadJson('./assets/json/player.json', () => {
            this._clipExplosion.Load('./assets/sounds/8bitexplosion.mp3');
            this._clipInpact.Load('./assets/sounds/inpactRock2.ogg');
            this._spriteRenderer?.SetSprite(this._sprite);
            this.shap = new jcls.Box(this.width, this.height);
            this.shap.center = this.position;
            this.shap.rotation = this.rotation;
            this.setIsLoaded(true);
            this.InitPhysics();
            if (this.physicsCollider !== null)
                this.physicsCollider.LayerName = "Player";
        });
        /* this.image.src = './assets/player.png';
         this.image.addEventListener('load', () => {
           this.height = this.image.height;
           this.width = this.image.width;
     
           this.boundingBox = new jcls.Bounds(new
             jcls.Vector2(this.position.x, this.position.y), new
             jcls.Vector2(this.width, this.height));
         })*/
    }
    Update(deltaTime) {
        if (this.cooldownDamage > 0)
            this.cooldownDamage -= deltaTime;
        if (this.life <= 0) {
            //this.Destroy();
            //this._soundEffect.PlayOneShot(this._clipExplosion);
            //window.location.reload();
        }
        //* set velocity to zero
        if (this.physicsCollider !== null)
            this.physicsCollider.velocity = new jcls.Vector2(0, 0);
        this.camera.position = new jcls.Vector2(this.position.x, this.position.y);
        const h = jcls.Behavior_Instance.SCREEN_HEIGHT;
        const w = jcls.Behavior_Instance.SCREEN_WIDTH;
        let mouseCoord = this.camera.ScreenToWorldPoint(jcls.Input.GetMouseCoord());
        let distance = this.position.Distance(mouseCoord);
        if (distance > 2.5) {
            let angle = Math.atan2(mouseCoord.y - this.position.y, mouseCoord.x - this.position.x);
            this.rotation = (angle) * 180 / Math.PI;
        }
        // GetAxis(jcls.EInput.forward,
        // jcls.EInput.backward,
        // )
        let vertical = -jcls.Input.GetAxis(jcls.EInput.forward, jcls.EInput.backward);
        let horizontal = jcls.Input.GetAxis(jcls.EInput.left, jcls.EInput.right);
        let a = this.Forward.Multiply(vertical);
        let b = this.Right.Multiply(horizontal);
        let direction = a.Add(b);
        let normaldirection = jcls.Vector2.zero;
        normaldirection.x = jcls.MathF.Clamp(direction.x, -1, 1);
        normaldirection.y = jcls.MathF.Clamp(direction.y, -1, 1);
        //direction = direction.Normalized;
        direction.MultiplyNR(this.speed * deltaTime);
        this.position.AddNR(normaldirection);
        /*if (vertical !== 0) {
          // add forward vector
          //this.position.y += this.Forward.y * vertical * this.speed * deltaTime;
        }
    
        if (horizontal !== 0) {
          //this.position.x += this.Forward.x * horizontal * this.speed * deltaTime;
        }*/
        /*if (jcls.Input.GetInput(jcls.EInput.forward)
          && this.position.y - this.height / 2 > 0
        ) {
          this.position.y -= this.speed * deltaTime;
        }
    
        if (jcls.Input.GetInput(jcls.EInput.backward)
          && this.position.y + this.height / 2 < h
        ) {
          this.position.y += this.speed * deltaTime;
        }
        if (jcls.Input.GetInput(jcls.EInput.left)
          && this.position.x - this.width / 2 > 0
        ) {
          this.position.x -= this.speed * deltaTime;
        }
        if (jcls.Input.GetInput(jcls.EInput.right)
          && this.position.x + this.width / 2 < w
        ) {
          this.position.x += this.speed * deltaTime;
        }*/
        if (jcls.Input.GetInput(jcls.EInput.space)) {
            if (this.cooldown <= 0) {
                this.cooldown = this.cooldownMax;
                let m = jcls.BehaviorPooling.Instance.Get("Missile");
                m.SetTag(Tags.Player_Missile);
                if (m.physicsCollider !== null)
                    m.physicsCollider.velocity = new jcls.Vector2(0, 0);
                m.SetPosition(new jcls.Vector2(this.position.x + this.width / 2, this.position.y));
            }
        }
        this.cooldown -= deltaTime;
        this.score += 0.025 * deltaTime;
    }
    Draw(ctx, deltaTime) {
        let mouseCoord = this.camera.ScreenToWorldPoint(jcls.Input.GetMouseCoord());
        /* debug mouse coord */
        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.arc(mouseCoord.x, mouseCoord.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        /* debug forward */
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(this.position.x + this.Forward.x * 50, this.position.y + this.Forward.y * 50);
        ctx.stroke();
        /* debug right */
        ctx.beginPath();
        ctx.strokeStyle = "blue";
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(this.position.x + this.Right.x * 50, this.position.y + this.Right.y * 50);
        ctx.stroke();
        //let x = Math.round(this.position.x)
        //let y = Math.round(this.position.y)
        this._spriteRenderer?.Draw(ctx, this.position, this.rotation, new jcls.Vector2(this.width, this.height));
        /*ctx.drawImage(this.image,
    
        );*/
    }
    OnDestroy() {
        //window.location.reload();
    }
    cooldownDamage = 0;
    AsteroideLast = null;
    OnCollisionEnter(other) {
        if (other.GetTag() === Tags.Asteroide) {
            if (this.AsteroideLast !== other) {
                this.AsteroideLast = other;
                this.cooldownDamage = 0;
            }
            if (this.cooldownDamage <= 0) {
                //this.Destroy();
                this.life -= 1;
                HealPointBar.SetHealPointBar(this.life);
                this.cooldownDamage = 1;
                this._soundEffect.PlayOneShot(this._clipInpact);
            }
        }
    }
}
