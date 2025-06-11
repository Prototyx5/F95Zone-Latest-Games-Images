// ==UserScript==
// @name         F95Zone - Latest Games Images
// @namespace    https://github.com/Prototyx5/
// @downloadURL  https://github.com/Prototyx5/F95Zone-Latest-Games-Images/raw/refs/heads/main/F95zone-Latest-Games-Images.user.js
// @version      1.2
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




	const debounce = (func, delay=50)=>{
		let timer;
		return (...args)=>{
			clearTimeout(timer);
			timer = setTimeout(()=>func.apply(this, args), delay);
		}
	};
	const handle = debounce(()=>{
		log('handle');
		$$('.resource-tile_gallery-wrap:not([data-lgi])').forEach(gallery=>{
			gallery.setAttribute('data-lgi', 1);
                        const oldCur = $('.resource-tile_gallery-index');
                        if (!oldCur) return;
                        oldCur.style.display = 'none';
			const cur = document.createElement('span'); {
				cur.textContent = '1';
				oldCur.insertAdjacentElement('afterend', cur);
			}
			const imgs = $$(gallery, 'li');
			const markers = [];
			const w = gallery.getBoundingClientRect().width / imgs.length;
			imgs.forEach((img,idx)=>{
				const marker = document.createElement('div');
				marker.classList.add('f95-lgi--marker');
				marker.style.left = `${w*idx}px`;
				marker.style.width = `${w}px`;
				gallery.parentElement.append(marker);
				markers.push(marker);
			});
                        const moved = evt=>{
                                const rect = gallery.getBoundingClientRect();
                                const step = rect.width / imgs.length;
                                let idx = Math.floor((evt.x - rect.left) / step);
                                idx = Math.max(0, Math.min(idx, imgs.length - 1));
                                cur.textContent = idx+1;
                                imgs.forEach((img, i)=>{
                                        img.classList[i==idx?'add':'remove']('f95-lgi--active');
                                });
                        };
                        const leave = () => {
                                cur.textContent = '1';
                                imgs.forEach(img => img.classList.remove('f95-lgi--active'));
                        };
                        gallery.addEventListener('mousemove', moved);
                        gallery.addEventListener('mouseleave', leave);
		});
	});

	const init = async()=>{
		log('init');
		GM_addStyle(`
			.f95-lgi--active {
				opacity: 1.0 !important;
				z-index: 4 !important;
			}
			.f95-lgi--marker {
				position: absolute;
				top: 0;
				border-left: 1px solid rgb(236 85 85);
				border-right: 1px solid rgb(236 85 85);
				height: 10px;
				z-index: 10;
				pointer-events: none;
			}
			.resource-tile_gallery-wrap > * {
				pointer-events: none;
			}
		`);
		handle();
	};
	init();

	const mo = new MutationObserver(muts=>handle());
	mo.observe(document.body, {childList:true, subtree:true, attributes:true});
})();
