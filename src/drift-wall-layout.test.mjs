import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {transformSync} from 'esbuild';

// Run mount layout effects without a browser, animation frame or pointer event.
function mount(source,props={}){
  const layout=[],nodes=[];
  const createElement=(type,props,...children)=>{
    const node={type,props:props||{},children,style:{}};
    nodes.push(node);
    if(typeof props?.ref==='function')props.ref(node);
    else if(props?.ref)props.ref.current=node;
    return node;
  };
  const context={React:{createElement},useCallback:fn=>fn,useMemo:fn=>fn(),
    useRef:value=>({current:value}),useState:value=>[value,()=>{}],
    useEffect:()=>{},useLayoutEffect:fn=>layout.push(fn),
    ResizeObserver:class{observe(){}disconnect(){}}};
  const code=source.replace(/^import .*;\r?\n/gm,'')
    .replace('export default DriftWall;','globalThis.Component=DriftWall;');
  vm.runInNewContext(transformSync(code,{loader:'jsx',jsx:'transform'}).code,context);
  context.Component(props);
  layout.forEach(effect=>effect());
  return nodes;
}

test('wall and columns are positioned before any frame or pointer event',()=>{
  const source=readFileSync(new URL('./components/DriftWall.jsx',import.meta.url),'utf8');
  const nodes=mount(source,{columns:3,tilt:8,turn:-10,roll:2,depth:80});
  const plane=nodes.find(node=>node.props.className==='drift-wall__plane');
  assert.equal(plane.style.transform,'translate(-50%, -50%) scale(1.16) rotateX(8deg) rotateY(-10deg) rotateZ(2deg) translateZ(-80px)');
  const tracks=nodes.filter(node=>node.props.className==='drift-wall__track');
  assert.equal(tracks.length,3);
  tracks.forEach(track=>assert.match(track.style.transform,/^translate3d\(0, -?\d+(?:\.\d+)?px, 0\)$/));
  assert.notEqual(tracks[1].style.transform,tracks[0].style.transform);
});
