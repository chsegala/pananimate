/*
pananimate for jquery
Animates larger images into smaller containers, panning the image up and down or sideways accordingly

Copyright (c) 2013 Christian Segala (https://github.com/chsegala)
Licensed under the MIT license
Version: 1.0
*/
(function($){
	$.extend($.fn, {
		pananimate: function(options){
			var defaults = {
				delay: 3000,
				animationSpeed: 1500,
				animationType: 'loop',
				direction: 'forward'
			};

			var options = $.extend(defaults, options);
			var animation = null;

			var getAnimationFunction = function(animationType){
				switch(animationType){
					case 'loop':
						return loopAnimation;
					case 'single':
						return singleAnimation;
					case 'gotoAndStop':
						return gotoAndStopAnimation;
				}
				return loopAnimation //default case
			};

			var loopAnimation = function(image, options, positions){
				$(image).delay(options.delay).animate({
					'margin-left': positions.startX,
					'margin-top': positions.startY
				}, options.animationSpeed)
				.delay(options.delay).animate({
					'margin-left': positions.endX,
					'margin-top': positions.endY
				}, options.animationSpeed, 
				    function(){ loopAnimation(image, options, positions); }
				);
			};

			var singleAnimation = function(image, options, positions){
				$(image).click(function(){
					$(image)
					.animate({
						'margin-left': positions.startX,
						'margin-top': positions.startY
					}, options.animationSpeed)
					.delay(options.delay)
					.animate({
						'margin-left': positions.endX,
						'margin-top': positions.endY
					}, options.animationSpeed);
				});
				$(image).delay(options.delay).click();
			};

			var gotoAndStopAnimation = function(image, options, positions){
				var go = true;
				$(image).click(function(){
					if(go){
						go = !go;
						$(image).animate({
								'margin-left': positions.startX,
								'margin-top': positions.startY
							}, options.animationSpeed);
					}else{
						go = !go;
						$(image).animate({
							'margin-left': positions.endX,
							'margin-top': positions.endY
						}, options.animationSpeed);
					}
				});
				$(image).delay(options.delay).click();
			};

			var frame = $(this).parent();
			$(this).load(function(){
				var image = $(this);
				var imageSize = {
					ratio: function(){
						return image.width() / image.height();
					},
					isLandscape: function(){
						return imageSize.ratio() >= 1;
					}
				}

				if(imageSize.isLandscape()){
					if(image.height() > frame.height()){
						image.height(frame.height());
					}
				}else{
					if(image.width() > frame.width()){
						image.width(frame.width());
					}
				}

				var deltaX =  imageSize.isLandscape() && frame.width()  < image.width()  ? Math.abs(frame.width()  - image.width() ) : 0;
				var deltaY = !imageSize.isLandscape() && frame.height() < image.height() ? Math.abs(frame.height() - image.height()) : 0;

				var positions = {
					endX: options.direction === 'forward' ? 0 : -deltaX,
					endY: options.direction === 'forward' ? 0 : -deltaY,
					startX: options.direction === 'forward' ? -deltaX : 0,
					startY: options.direction === 'forward' ? -deltaY : 0
				};

				if(options.direction !== 'forward'){
					console.log('backward');
					$(image).css('margin-top', -deltaY + 'px').css('margin-left', -deltaX + 'px');
				}

				animation = getAnimationFunction(options.animationType);
				animation(image, options, positions);
			});
		}
	});
})(jQuery);