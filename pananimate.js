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
				animationSpeed: 1500
			};

			var options = $.extend(defaults, options);

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

				if(imageSize.isLandscape()){}
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

				var animation = function(){
					$(image).delay(options.delay).animate({
						'margin-left': -deltaX,
						'margin-top': -deltaY
					}, options.animationSpeed).delay(options.delay).animate({
						'margin-left': 0,
						'margin-top': 0
					}, options.animationSpeed, animation);
				};
				animation();
			});
		}
	});
})(jQuery);