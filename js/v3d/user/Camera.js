
V3d.Camera = function(params){
    this.params = params;
};

Object.assign(V3d.Camera.prototype, {
    FirstPersonControls: function(container, params){
        if(this.fpsControls === undefined && container !== undefined) this.fpsControls = new V3d.Navigation.FirstPerson(this.camera, container);
        if(params !== undefined){
            this.fpsControls.speed.set(params.speedX, params.speedY);
            this.fpsControls.damping = params.damping;
            this.fpsControls.momentum = params.momentum;
            this.fpsControls.limitPhi = params.limitPhi;
        }

        this.controls = this.fpsControls;
    },

    OrbitControls: function(container, params){
        if(this.orbitControls === undefined && container !== undefined){
            this.orbitControls = new THREE.OrbitControls(this.camera, container);
            this.orbitControls.target = new THREE.Vector3();
            this.orbitControls.Update = function(){
                if(this.object.position.distanceTo(this.target) < 50){
                    var v = new THREE.Vector3().subVectors(this.target, this.object.position).multiplyScalar(.5);
                    this.target.add(v);
                }
                this.update();
            };
        }
        params = {
            maxDistance: 9000.0 * /*units*/1,
            maxPolarAngle: Math.PI * 0.895
        }
        if(params !== undefined){
            this.orbitControls.maxDistance = params.maxDistance;
            this.orbitControls.maxPolarAngle = params.maxPolarAngle;
            this.orbitControls.autoRotate = false;
        }

        this.controls = this.orbitControls;
    },

    SetTarget: function(position){
        if(this.controls instanceof THREE.OrbitControls){
            this.controls.target.copy(position);
        }
        else {
            console.warn('SetTarget not implement for control type:', this.controls);
        }
    },

    Update: function(){
        if(this.controls !== undefined){
            this.controls.Update();
        }
    }
});

V3d.User.Camera = function(params){
    V3d.Camera.call(this, params);

    this.camera = new THREE.PerspectiveCamera(this.params.fov, this.params.aspect, this.params.near, this.params.far);
    this.camera.name = 'UserCamera';
};

V3d.User.Camera.prototype = Object.assign(Object.create(V3d.Camera.prototype), {
    constructor: V3d.User.Camera
    
});

Object.defineProperty(V3d.User.Camera.prototype, 'position', {
    get: function(){
        return this.camera.position;
    },

    set: function(value){
        this.camera.position.copy(value);
    }
});