// ==UserScript==
// @name         F95Zone - Latest Games Images
// @namespace    https://github.com/LenAnderson/
// @downloadURL  https://github.com/LenAnderson/F95zone-Latest-Games-Images/raw/master/F95zone-Latest-Games-Images.user.js
// @version      1.0
// @description  Move mouse from left to right to navigate preview images on Latest Games page.
// @author       LenAnderson
// @match        https://f95zone.to/sam/latest_alpha/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    const log = (...msgs)=>console.log.call(console.log, '[F95-LGI]', ...msgs);

	const $ = (root,query)=>(query?root:document).querySelector(query?query:root);
	const $$ = (root,query)=>Array.from((query?root:document).querySelectorAll(query?query:root));




	const handle = async()=>{
		log('init');
		$$('.resource-tile_gallery-wrap').forEach(gallery=>{
			if (gallery.hasAttribute('data-lgi')) return;
			gallery.setAttribute('data-lgi', 1);
			const imgs = $$(gallery, 'li');
			let hover = false;
			gallery.addEventListener('mouseover', ()=>hover = true);
			gallery.addEventListener('mouseout', ()=>hover = false);
			addEventListener('mousemove', evt=>{
				if (!hover) return;
				const rect = gallery.getBoundingClientRect();
				const step = rect.width / imgs.length;
				const idx = Math.floor((evt.x - rect.left) / step);
				imgs.forEach((img, i)=>{
					img.classList[i==idx?'add':'remove']('f95-lgi--active');
				});
			});
		});
	};

	const init = async()=>{
		GM_addStyle(`
			.f95-lgi--active {
				opacity: 1.0 !important;
				z-index: 4 !important;
			}
		`);
		handle();
	};
	init();

	const mo = new MutationObserver(muts=>handle());
	mo.observe(document.body, {childList:true, subtree:true, attributes:true});
})();
