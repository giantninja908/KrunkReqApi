import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@6.4.6/dist/fuse.esm.js'

import {skins} from './skins.js'

//console.log(skins)

const types = ['weapons/weapon_', 'hats/hat_', 'body/body_', 'melee/melee_', 'sprays/', 'dyes/', 'waist/waist_', 'faces/face_', 'shoes/shoe_', 'pets/pet_']

const locale = {
  'social.market.head': 1,
  'social.market.back': 2,
  'social.market.melee': 3,
  'social.market.spray': 4,
  'social.market.dye': 5,
  'social.market.waist': 6,
  'social.market.face': 7,
  'social.market.shoe': 8,
  'social.market.pet': 9,
}




const interpSkin = (skin) => { //have fun interpreting this!

  let a = {}
  a['item'] = skin
console.log(skin)
  let q = a['item']
  q['type'] = locale[a['item']['locale']]

  const modelUrl = 'https://assets.krunker.io/models/' + types[locale[a.item.locale] || 0] + (a['item']['type'] ? a['item']['id'] : a['item']['weapon']) + (null == a['item']['mid'] ? '' : '_' + a['item']['mid']) + '.obj'

  const previewUrl = ('https://assets.krunker.io/textures/' + (q['type'] && 4 == q['type'] && !q['is3D'] ? 'sprays/' + q['id'] : 'previews/' + (q['type'] && 0x3 != q['type'] ? 'cosmetics/' + q['type'] + '_' + q['id'] + (q['tex'] ? '_' + q['tex'] : '') : types[q['type'] || 0x0] + (q['type'] && 0x3 == q['type'] ? q['id'] + (null == q['pat'] ? null == q['tex'] ? '' : '_' + q['tex'] : '_c' + q['pat']) : (q['weapon'] || 0x0) + '_' + (null == q['mid'] ? null == q['pat'] ? q['tex'] ? q['tex'] : q['id'] : 'c' + q['pat'] : 'm' + q['mid'] + (null == q['midT'] ? '' : '_' + q['midT']))))) + '.png')

  const textureUrl = (((null == a['item']['mid'] ? types[locale[a['item']['locale']]] && 3 == types[locale[a['item']['locale']]] ? a['item']['pat'] ? a['item']['tex'] : 'melee/melee_' + (a['item']['id'] || 0x0) + (a['item']['tex'] ? '_' + a['item']['tex'] : '') : types[locale[a['item']['locale']]] ? a['item']['tex'] ? types[locale[a['item']['locale'] || 0]] + a['item']['id'] + '_' + a['item']['tex'] : (types[locale[a['item']['locale']]]+a['item']['id']) : a['item']['tex'] ? a['item']['tex'] : 'weapons/skins/weapon_' + a['item']['weapon'] + '_' + a['item']['id'] : "no")) || modelUrl.slice('https://assets.krunker.io/models/'.length).split('.')[0]);


  const texUrl = (a['item']['preview'].includes('spray') ? a['item']['preview'] : 'https://assets.krunker.io/textures'+a['item']['preview'].split("previews")[1].replace("weapons/",(typeof a['item']['id'] !== 'undefined' ? "weapons/skins/" : 'weapons/')).replace(/_m._/,"_").replace(/_m/,'_').replace("cosmetics/1_","hats/hat_").replace("cosmetics/2_","body/body_").replace("cosmetics/1_","hats/hat_").replace("cosmetics/7_","faces/face_").replace("cosmetics/6_","waist/waist_").replace(/weapon_._c/,"pat/")).replace("cosmetics/9_","pets/pet_")

  const emissiveTex = texUrl.replace(/\.png.*/,'')+"_e.png"

  return [modelUrl, previewUrl, textureUrl, texUrl, emissiveTex]
}

const main = (data) => {
  
  window.exportChar4 = () => {
    let exp = {};
    data['store']['skins'].forEach((a) => {
      exp[a['name']+"__"+a['id']+"_"+a['seas']+"_"+a['creator']] = interpSkin(a)
    })
    //console.log(JSON.stringify(exp));
    console.log(JSON.stringify(skins))
  }

  let fuse = new Fuse(data["store"]["skins"],{
    keys: ["name"],
    shouldSort: true
  })

  const commitSearch = (skins, value, limit) => {
    
  }
  
  const funco = () => {
    if (document.getElementById("skin").value.length < 2) {return}
    const res = data["store"]["skins"]
      .filter((e) => {
        return e["name"] ? e["name"].toLowerCase().startsWith(document.getElementById("skin").value.toLowerCase()) : false
        })
      .filter((a,b) => {return b<10})

    let da = '';
    for(let i=0;i<res.slice(1).length;i++){
      let a = res.slice(1)[i]

      console.log(a['item'])

      const [modelUrl, previewUrl, textureUrl, texUrl, em] = interpSkin(a)
      

      da+="<div class='itema'><p class='name'>"+a.name+"<br><span class='auth'> by "+a.creator+"</span></p><a class='prev' target='_blank' href='"+modelUrl+"'><img src='"+(a['preview'])+"'/></a><a class='diffuse' target='_blank' href='"+texUrl+"'><img src='"+texUrl+"'/></a><a class='emiss' target='_blank' href='"+em+"'><img src='"+em+"'/></a><div class='infoHolder'>ID: "+ a.id +"</div></div>"
    }
    console.log(fuse.options.keys)
    document.getElementById("results").innerHTML = da;
  }
  document.getElementById("skin").oninput = funco;

  document.getElementById("dropdown").onchange = (e) => {
    console.log(document.getElementById("dropdown").value)
    fuse = new Fuse(data["store"]["skins"],{
      keys: [document.getElementById("dropdown").value]
    })
  }
}



fetch("krunker.json")
  .then((a) => a.json())
  .then((b) => main(b))



