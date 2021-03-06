'use strict';

let path = require('path'),
    mkdirp = require('mkdirp'),
    fs = require('fs');

var functions = {
    
    getCurNameSlide: function(n){
        var p = global.config.presentation;
        return p.slidePrefix + n + "_" + p.nl_PID + "_" + p.brand + "_" + p.lang;  
    },
    
    getCurNamePresentation: function(n){
        var p = global.config.presentation;
        if(!n) n = Object.keys(global.config.settings.map)[0];
        return p.presentPrefix + n + "_" + p.nl_PID + "_" + p.brand + "_" + p.lang;  
    },
    
    getCurPresentation: function(s){
        for(var i in global.config.settings.map){
            var obj = global.config.settings.map[i].slides;
            if(obj.indexOf(s) >= 0){
                return functions.getCurNamePresentation(i);
            }
        }	
    },
    
    setPresentSettings: function(){
        var obj = {};
        var p = global.config.settings;

        for (var e in p.map) {
            obj[ functions.getCurNamePresentation(e) ] = functions.getObjData(p.map[e]);
        }
        return obj;
    },
    
    setPresentLinks: function(){
        var newLinks = [],
            p = global.config.settings,
            s = global.config.slides;

        for (var e in p.links) {
            newLinks.push({ 
                class: p.links[e].class, 
                slideTo: functions.getCurNameSlide(p.links[e].slideTo), 
                presentTo: functions.getCurNamePresentation(p.links[e].presentTo) 
            });
        }  
        for (var e in s) {
            newLinks.push({ 
                class: '_goto_' + s[e].num, 
                slideTo: functions.getCurNameSlide(s[e].num), 
                presentTo: functions.getCurPresentation(s[e].num) 
            });
        }    
        return newLinks;
    },
    
    getObjData: function(obj){
        var newObj = {};    

        newObj["slides"] = obj.slides.reduce(function(p,c){
            p.push(functions.getCurNameSlide(c)); return p;
        },[]);
        newObj["p_slide"] = obj.p_slide ? functions.getCurNameSlide(obj.p_slide) : "";
        newObj["p_pres"] = obj.p_pres ? functions.getCurNamePresentation(obj.p_pres) : "";
        return newObj;
    },
    
    getDetailGroup: function(brand){
        brand = brand.toLowerCase();
        for (var e in functions.referenceData) {
            if(functions.referenceData[e].brand == brand){
                return functions.referenceData[e].detailGroup;
                break;
            }
        }
    },
    
    getGroups: function(brand){
        brand = brand.toLowerCase();
        for (var e in functions.referenceData) {
            if(functions.referenceData[e].brand == brand){
                return functions.referenceData[e].groups;
                break;
            }
        }
    },
    
	referenceData: [
		{brand: 'betaloc', groups: '[RU_CV_1],[RU_Brand_Team]', detailGroup: 'CV_RU'},
		{brand: 'crestor', groups: '[RU_CV_1],[RU_CV_2],[RU_Brand_Team]', detailGroup: 'CV_RU'},
		{brand: 'brilinta', groups: '[RU_CV_1],[RU_CV_2],[RU_Brand_Team]', detailGroup: 'CV_RU'},
		{brand: 'byetta', groups: '[RU_DIABETES],[RU_Brand_Team]', detailGroup: 'Diabet_RU'},
		{brand: 'komboglyze', groups: '[RU_DIABETES],[RU_Brand_Team]', detailGroup: 'Diabet_RU'},
		{brand: 'onglyza', groups: '[RU_DIABETES],[RU_Brand_Team]', detailGroup: 'Diabet_RU'},
		{brand: 'forxiga', groups: '[RU_DIABETES],[RU_Brand_Team]', detailGroup: 'Diabet_RU'},
		{brand: 'pulmicort', groups: '[RU_RIA_1],[RU_Brand_Team]', detailGroup: 'RIA_RU'},
		{brand: 'symbicort', groups: '[RU_RIA_1],[RU_RIA_2],[RU_Brand_Team]', detailGroup: 'RIA_RU'},
		{brand: 'bretaris', groups: '[RU_RIA_1],[RU_RIA_2],[RU_Brand_Team]', detailGroup: 'RIA_RU'},
		{brand: 'iressa', groups: '[RU_ONCO],[RU_Brand_Team]', detailGroup: 'Onco_RU'},
		{brand: 'zoladex', groups: '[RU_ONCO],[RU_Brand_Team]', detailGroup: 'Onco_RU'},
		{brand: 'faslodex', groups: '[RU_ONCO],[RU_Brand_Team]', detailGroup: 'Onco_RU'},
		{brand: 'zinforo', groups: '[RU_AB],[RU_Brand_Team]', detailGroup: 'Gr+_Inf_RU'},
		{brand: 'seroquel', groups: '[RU_CNS],[RU_Brand_Team]', detailGroup: 'CNS_RU'},
		{brand: 'nexium', groups: '[RU_GI],[RU_Brand_Team]', detailGroup: 'GI_RU'}
	],
    
    createEmptyImgFolders: function(){
        
        let assetsPath = path.join(global.config.sourceDir, '_assets');
        fs.exists(assetsPath, function(exists) {
            if (!exists) {
                mkdirp(assetsPath, function (err) {
                    if (err) console.error(err)
                    else console.log('Creating empty assets dir in ' + assetsPath);
                });
            }
        });
        
        let filesPath = path.join(global.config.sourceDir, '_files');
        fs.exists(filesPath, function(exists) {
            if (!exists) {
                mkdirp(filesPath, function (err) {
                    if (err) console.error(err)
                    else console.log('Creating empty files dir in ' + filesPath);
                });
            }
        });
        
        config.slides.map(function(currentSlide){
            if(currentSlide.isFile || currentSlide.copy) return false;
            let sourcePath = path.join(global.config.sourceDir, '_images', currentSlide.num+'');
            fs.exists(sourcePath, function(exists) {
                if (!exists) {
                    mkdirp(sourcePath, function (err) {
                        if (err) console.error(err)
                        else console.log('Creating empty images dir in ' + sourcePath);
                    });
                }
            });
        });        
    },
    
    projectRoot: process.cwd()
}
       
global.config.MAP = "map:" + JSON.stringify( functions.setPresentSettings() ) + ",";
global.config.LINKS = "links:" + JSON.stringify( functions.setPresentLinks() ) + ",";
global.config.readyBDir = path.join('_build', functions.getCurNamePresentation(), '/');
global.config.tempDir = path.join('_build', "._temp_" + functions.getCurNamePresentation(""), '/');
global.config.sourceDir = path.join(global.config.sourceDir, '/');

module.exports = functions;