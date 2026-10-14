import * as THREE from 'three';

/*
 * Procedural caganer (Catalan nativity figurine) built from the reference photo:
 * painted clay, red barretina with black band, white shirt, red sash, black
 * trousers pulled down, bare bottom, pipe and the inevitable gift on a grey rock.
 * Local frame: Y up, the figure faces +Z, base on y = 0, about 1.05 units tall.
 * Stylized, smooth-shaded like glazed clay, sized to read at ~70px on screen.
 */

type Track = <T extends { dispose():void }>(item:T) => T;

const PALETTE = {
  cap:'#d23a2c', band:'#1f1a1c', shirt:'#f3efe6', sash:'#c9302a', trousers:'#1d1b20',
  shoes:'#6e3f26', skin:'#efc2a3', cheek:'#e79a8c', hair:'#4a2e22', rock:'#8c9196', poop:'#8e5229', eye:'#1a1416'
};

export function createCaganerModel(track:Track) {
  const root = new THREE.Group(); root.name = 'caganer';
  const clay = (color:string, roughness = .55) => track(new THREE.MeshStandardMaterial({ color, roughness, metalness:0 }));
  const m = {
    cap:clay(PALETTE.cap, .5), band:clay(PALETTE.band, .45), shirt:clay(PALETTE.shirt, .6), sash:clay(PALETTE.sash, .5),
    trousers:clay(PALETTE.trousers, .42), shoes:clay(PALETTE.shoes, .5), skin:clay(PALETTE.skin, .58), cheek:clay(PALETTE.cheek, .6),
    hair:clay(PALETTE.hair, .6), rock:clay(PALETTE.rock, .78), poop:clay(PALETTE.poop, .4), eye:clay(PALETTE.eye, .3)
  };
  const add = (parent:THREE.Object3D, g:THREE.BufferGeometry, mat:THREE.Material, name:string, pos:[number, number, number], scale?:[number, number, number], rot?:[number, number, number]) => {
    const mesh = new THREE.Mesh(track(g), mat); mesh.name = name;
    mesh.position.set(...pos); if (scale) mesh.scale.set(...scale); if (rot) mesh.rotation.set(...rot);
    mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  };
  const ball = (r:number, w = 18, h = 14) => new THREE.SphereGeometry(r, w, h);
  /* a capsule between two points: limbs bent at knee/elbow without a rig */
  const limb = (parent:THREE.Object3D, mat:THREE.Material, name:string, a:THREE.Vector3, b:THREE.Vector3, r:number) => {
    const dir = b.clone().sub(a), len = dir.length();
    const mesh = add(parent, new THREE.CapsuleGeometry(r, Math.max(.001, len), 6, 14), mat, name, a.clone().add(b).multiplyScalar(.5).toArray() as [number, number, number]);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    return mesh;
  };
  const v = (x:number, y:number, z:number) => new THREE.Vector3(x, y, z);

  /* base: lumpy grey rock slab, jittered deterministically */
  const rockGeo = new THREE.CylinderGeometry(.42, .47, .075, 24, 1);
  const p = rockGeo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const a = Math.atan2(p.getZ(i), p.getX(i)), lump = 1 + .07 * Math.sin(a * 3 + 1.3) + .05 * Math.sin(a * 5);
    p.setXYZ(i, p.getX(i) * lump, p.getY(i) + (p.getY(i) > 0 ? .012 * Math.sin(a * 4) : 0), p.getZ(i) * lump * .86);
  }
  rockGeo.computeVertexNormals();
  add(root, rockGeo, m.rock, 'base', [0, .038, 0]);

  /* the gift: three stacked coils and a curl, behind and under the bottom */
  const poop = new THREE.Group(); poop.name = 'poop'; poop.position.set(-.02, .09, -.21); root.add(poop);
  add(poop, new THREE.TorusGeometry(.055, .032, 10, 18), m.poop, 'poop-coil-1', [0, .025, 0], undefined, [Math.PI / 2, 0, 0]);
  add(poop, new THREE.TorusGeometry(.038, .027, 10, 16), m.poop, 'poop-coil-2', [0, .07, 0], undefined, [Math.PI / 2, 0, .6]);
  add(poop, new THREE.ConeGeometry(.04, .07, 12), m.poop, 'poop-tip', [0, .115, 0], undefined, [0, 0, .25]);

  /* legs: deep crouch — thighs rise forward from the hip to the knee, shins drop to the shoes */
  for (const side of [-1, 1]) {
    const hip = v(side * .1, .3, -.05), knee = v(side * .16, .41, .14), ankle = v(side * .15, .13, .11);
    limb(root, m.trousers, `thigh-${side < 0 ? 'r' : 'l'}`, hip, knee, .112);
    limb(root, m.trousers, `shin-${side < 0 ? 'r' : 'l'}`, knee, ankle, .092);
    add(root, ball(.07), m.shoes, `shoe-${side < 0 ? 'r' : 'l'}`, [side * .14, .125, .17], [1, .7, 1.75]);
    add(root, ball(.112), m.skin, `buttock-${side < 0 ? 'r' : 'l'}`, [side * .065, .285, -.16], [1, 1.05, .95]);
  }
  /* trousers bunched at the knees/front of the seat, not covering the bottom */
  add(root, ball(.13), m.trousers, 'seat-front', [0, .33, .02], [1.3, .75, .9]);

  /* torso: loose shirt leaning slightly forward, sash at the waist */
  const torso = new THREE.Group(); torso.name = 'torso'; torso.position.set(0, .39, -.08); torso.rotation.x = .34; root.add(torso);
  add(torso, new THREE.CylinderGeometry(.165, .172, .075, 20), m.sash, 'sash', [0, .03, 0]);
  add(torso, ball(.18), m.shirt, 'shirt', [0, .17, .01], [1.12, 1.18, .98]);
  add(torso, new THREE.CylinderGeometry(.055, .065, .06, 12), m.skin, 'neck', [0, .36, .02]);

  /* arms: sleeves down then forward, hands resting on the knees */
  for (const side of [-1, 1]) {
    const shoulder = v(side * .18, .6, .03), elbow = v(side * .22, .46, .09), hand = v(side * .17, .45, .21);
    limb(root, m.shirt, `upper-arm-${side < 0 ? 'r' : 'l'}`, shoulder, elbow, .058);
    limb(root, m.shirt, `forearm-${side < 0 ? 'r' : 'l'}`, elbow, hand, .052);
    add(root, ball(.048), m.skin, `hand-${side < 0 ? 'r' : 'l'}`, [side * .165, .455, .235], [1, .85, 1.1]);
  }

  /* head */
  const head = new THREE.Group(); head.name = 'head'; head.position.set(0, .8, .1); root.add(head);
  add(head, ball(.13), m.skin, 'face', [0, 0, .01], [1, 1.08, 1]);
  add(head, ball(.13), m.hair, 'hair', [0, -.005, -.03], [1.02, 1.04, .98]);
  add(head, ball(.026), m.skin, 'nose', [0, -.005, .14], [1, .9, 1.2]);
  for (const side of [-1, 1]) {
    add(head, ball(.014), m.eye, `eye-${side < 0 ? 'r' : 'l'}`, [side * .045, .025, .124]);
    add(head, ball(.026), m.cheek, `cheek-${side < 0 ? 'r' : 'l'}`, [side * .07, -.03, .1], [1, .7, .5]);
  }

  /* barretina: black band at the brow, red stocking cap folding back over the nape */
  add(head, new THREE.CylinderGeometry(.138, .136, .05, 24), m.band, 'barretina-band', [0, .085, -.005], undefined, [-.12, 0, 0]);
  add(head, ball(.14), m.cap, 'barretina-crown', [0, .14, -.04], [1.02, .76, 1.18], [-.4, 0, 0]);
  add(head, ball(.09), m.cap, 'barretina-fold', [0, .135, -.135], [1.15, .85, 1], [-.7, 0, 0]);

  /* pipe: hooked stem from the mouth, bowl turned up */
  const pipe = new THREE.CatmullRomCurve3([v(0, -.06, .12), v(0, -.075, .2), v(0, -.07, .26), v(0, -.035, .285)]);
  add(head, new THREE.TubeGeometry(pipe, 16, .012, 8), m.band, 'pipe-stem', [0, 0, 0]);
  add(head, new THREE.CylinderGeometry(.024, .018, .045, 12), m.band, 'pipe-bowl', [0, -.02, .288]);

  return root;
}

/* Smoke-bomb puff: lumpy grey cartoon clouds that burst out, rise and fade. */
export function createSmokePuff(track:Track, origin:THREE.Vector3, size:number) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const ctx = c.getContext('2d')!;
  /* a cloud is a few overlapping shaded discs: light on top, grey underneath */
  for (const [x, y, r] of [[64, 74, 40], [42, 64, 27], [86, 62, 29], [62, 44, 30], [80, 84, 24], [44, 86, 22]]) {
    const g = ctx.createRadialGradient(x - r * .3, y - r * .4, r * .1, x, y, r);
    g.addColorStop(0, '#ffffff'); g.addColorStop(.6, '#e9e3e5'); g.addColorStop(.92, '#c9bfc4'); g.addColorStop(1, 'rgba(201,191,196,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  const tex = track(new THREE.CanvasTexture(c)); tex.colorSpace = THREE.SRGBColorSpace;
  const group = new THREE.Group(); group.name = 'smoke';
  const puffs = Array.from({ length:14 }, (_, i) => {
    const material = track(new THREE.SpriteMaterial({ map:tex, color:i % 3 ? '#f4f0f1' : '#d8cfd3', transparent:true, depthWrite:false, opacity:0 }));
    const sprite = new THREE.Sprite(material);
    const a = i * 2.39996, up = (i % 5) / 4;
    const reach = size * (.42 + (i % 3) * .12);
    const dir = new THREE.Vector3(Math.cos(a) * (1 - up * .45), up * .9 - .05, Math.sin(a) * (1 - up * .45)).multiplyScalar(reach);
    sprite.position.copy(origin); group.add(sprite);
    return { sprite, dir, delay:(i % 4) * 30, grow:.32 + (i % 4) * .07, spin:(i % 2 ? 1 : -1) * (.5 + up) };
  });
  const flash = new THREE.PointLight('#fff1d6', 0, size * 4); flash.position.copy(origin); group.add(flash);
  const duration = 1150;
  /* returns true while the puff is still animating */
  function update(elapsed:number) {
    for (const p of puffs) {
      const t = THREE.MathUtils.clamp((elapsed - p.delay) / (duration - p.delay), 0, 1);
      const out = 1 - Math.pow(1 - t, 4);
      p.sprite.position.copy(origin).addScaledVector(p.dir, out);
      p.sprite.position.y += t * t * size * .45;
      p.sprite.scale.setScalar(size * p.grow * (.45 + out * .75) * (1 - t * t * .35));
      p.sprite.material.rotation = p.spin * out;
      p.sprite.material.opacity = t <= 0 ? 0 : Math.min(1, t * 10) * (1 - Math.pow(t, 2.2));
    }
    flash.intensity = Math.max(0, 1 - elapsed / 240) * 7;
    return elapsed < duration;
  }
  return { group, update };
}
