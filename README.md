# Random Pollock

![montage-1](output/images/montages/montage-resized-1.png)

![montage-2](output/images/montages/montage-resized-2.png)

## [Try it here](https://lorenzoros.si/random-pollock/)

![montage-3](output/images/montages/montage-resized-3.png)

![montage-4](output/images/montages/montage-resized-4.png)

## One big question

One of the artist that I admire the most is Jackson Pollock. He has created more than 20 of the most famous abstract expressionist paintings. He is also the father of the *action painting*, a unique style of painting in which the paint is *splashed* (is this even a word?) on the canvas and let drip. I wonder if the droplets of paint choose where to go, like they, and not the painter, had the ability to create a painting.

It is a really *curious* method, to say the least. Pollock himself was nicknamed "Jack the dripper" by the newspaper TIME. It was really revolutionary, I have to admit, even if I don't really like his work.

I would not like to own a Pollock, nor I would hang one of his paintings on a wall inside my home *(not that I would be able to afford it, since they sell for millions of dollars)* but I asked myself: *"Could I recreate his technique using code?"*

Also, one more question dawned on my mind: *If I can, could I also make as much money as he did?* but I think we all know the answer to this one.

## Additional questions

Now that I had the idea, *how could I make it real?*

First I decided to fire up the ol' good VSCode and clone [my lightweight html5 template](https://github.com/lorossi/empty-html5-canvas-project). To track the particles position, their speed, acceleration etc. I used a [custom JS library that I made a while back.](https://github.com/lorossi/js-vectors). In order to add some randomness in their movements and give a more natural behaviour, I used [simplex-noise.js by jwagner.](https://github.com/jwagner/simplex-noise.js/). It is really awesome library and can't say that enough. Finally, in order to record the videos I used [CCapture.js by spite](https://github.com/spite/ccapture.js/) to save the frames and FFMPEG to create the videos and the GIFs.

Surprisingly *(but not really)* the hardest part of the whole projects was to pick the color palettes. I used [Adobe colors](https://color.adobe.com/explore) and [coolors.co](https://coolors.co/). I am still quite working on it since because I can't really find a way to generate a random palette or an efficient way to choose one from the internet (I have to try them one by one). I initially thought that palettes with very different and complementary colors worked the best, but slowly I realized that gradients and monochrome palettes actually work even better. *I would be a terrible painter.*

*But how are the paintings created?* Basically, each particle is created on the canvas and a its color, size, life duration, speed (and other features, including size and length of the trail) are assigned according to a random noise function called *Simplex noise*. This creates particles that are more or less similar one another according to their distance. This generates spots of particles with the same size and color.
Each frame they then are accelerated in a new direction and then gravity is applied. Since I don't ever refresh the canvas, all the drips remain visible. After a while, the amount of color on the screen is really huge, but keep watching to see the painting slowly "evolve" and change over time!

Also, the particles are split in a few different layers, with a different seeding to the noise function. This adds a lot of variance, like contrasting brushes being used at the same time.

I would like to know how man times each pixel gets painted on, as a way to measure how much the painting would weight over time. Luckily there's no way to know that since pixels are information and information is weightless (almost).

## One big answer to end all questions

*Did I manage to do it?* Well, you tell me. Try the generator by yourself [here](https://lorenzoros.si/random-pollock/) *(click to generate a new painting and press the button to save it)* or take a look at some of the pre-rendered and pre-saved videos and images [on my Instagram account](https://www.instagram.com/lorossi97/) or just a little bit below in this page (although in low-quality, since GitHub doesn't allow anything other than GIFs).

**GIF ARE STILL WIP...**

## Credits

This project is distributed under Attribution 4.0 International (CC BY 4.0) license.
