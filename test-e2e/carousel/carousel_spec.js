describe("Carousel", function() {

  beforeEach(function(done) {
    browser.get("/#/sample/carousel");
    browser.driver.wait(protractor.until.elementLocated(By.tagName('carousel')), 10000);
    element.all(by.css("input[type=checkbox]")).then(function(checkboxes) {
      checkboxes[2].click().then(function() {
        done();
      })
    });
  });

  function validateCarousel(length, activeIndex, isLeftArrowShown, isRightArrowShown) {
    element.all(by.css("carousel div.carousel ol.carousel-indicators li")).then(function(dots) {
      expect(dots.length).toBe(length);
      for (var i = 0; i < length; i++) {
        expect(dots[i].getAttribute('class')).toBe((activeIndex === i ? 'active' : ''));  
      }
    });
    element.all(by.css("carousel div.carousel div.carousel-inner carousel-slide")).then(function(slides) {
      expect(slides.length).toBe(length);
      for (var i = 0; i < length; i++) {
        expect(slides[i].getAttribute('class')).toBe('item' + (activeIndex === i ? ' active' : ''));  
      }
    });
    element.all(by.css("carousel div.carousel a.carousel-control")).then(function(arrows) {
      expect(arrows.length).toBe(2);
      expect(arrows[0].getAttribute('class')).toBe('left carousel-control');
      expect(arrows[0].getAttribute('hidden')).toBe(isLeftArrowShown ? null : '');
      expect(arrows[1].getAttribute('class')).toBe('right carousel-control');
      expect(arrows[0].getAttribute('hidden')).toBe(isRightArrowShown ? null : '');
    });
  }

  it("should display a carousel with 3 slides, 3 dots, both arrows and second slide active", function() {   
    validateCarousel(3, 1, true, true);
  });

  it("should go to next when clicking right arrow", function() {   
    element.all(by.css("carousel div.carousel a.carousel-control")).then(function(arrows) {
      arrows[1].click().then(function() {validateCarousel(3, 2, true, true);})
      .then(arrows[1].click().then(function() {validateCarousel(3, 0, true, true);}))
      .then(arrows[1].click().then(function() {validateCarousel(3, 1, true, true);}));
    });
  });

  it("should go to previous when clicking left arrow", function() {   
    element.all(by.css("carousel div.carousel a.carousel-control")).then(function(arrows) {
      arrows[0].click().then(function() {validateCarousel(3, 0, true, true);})
      .then(arrows[0].click().then(function() {validateCarousel(3, 2, true, true);}))
      .then(arrows[0].click().then(function() {validateCarousel(3, 1, true, true);}));
    });
  });

  it('should select a slide when clicking on slide indicators', function () {
    element.all(by.css("carousel div.carousel ol.carousel-indicators li")).then(function(dots) {
      dots[0].click().then(function() {validateCarousel(3, 0, true, true);})
      .then(dots[2].click().then(function() {validateCarousel(3, 2, true, true);}))
    });
  });
});