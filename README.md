# Random Pollock

## One big question

One of the artist that I admire the most is Jackson Pollock. He has created more than 20 of the most famous abstract expressionist paintings. He is also the father of the *action painting*, a unique style of painting in which the paint is *splashed* (is this even a word?) on the canvas and let drip.

It is a really *curious* method, to say the least. Pollock himself was nicknamed "Jack the dripper" by the newspaper TIME. I wonder if the droplets of paint choose where to go.

I would not like to own a Pollock, nor I would hang one of his paintings on a wall inside my home *(not that I would be able to afford it, since they sell for millions of dollars)* but I asked myself: *"Can I replicate his technique using code?"*

Also, one more question dawned on my mind: *If I can, could I also make as much money as he did?* but I think we all know the answer to this one.

## Additional questions

Now that I had the idea, *how could I make it real?*

First I decided to fire up the ol' good VSCode and clone [my lightweight html5 template](https://github.com/lorossi/empty-html5-canvas-project). To track the particles position, their speed, acceleration etc. I used a [custom JS library that I made a while back.](https://github.com/lorossi/js-vectors). In order to add some randomness in their movements and give a more natural feeling, I used [simplex-noise.js by jwagner.](https://github.com/jwagner/simplex-noise.js/). It is really awesome library and can't say that enough.

Surprisingly *(but not really)* the hardest part was to pick the color palettes. I used [Adobe colors](https://color.adobe.com/explore) and [coolors.co](https://coolors.co/). I am still quite working on it since because I can't really find a way to generate a random palette or an efficient way to choose one from the internet (I have to try them one by one).

Basically, each particle is created on the canvas and a its color, size, life duration, speed... are all assigned according to the random noise function. Each frame they are accelerated in a new direction and then gravity is applied. Since I don't ever refresh the canvas, all the drips remain visible on it.

Also, the particles are split in a few different layers, behaving in completely different ways and not interacting at all with each other. This adds a lot of variance.

## One big answer to end all questions

*Did I manage to do it?* Well, you tell me by yourself. You can try the generator by yourself [here]() (click to generate a new painting and press the button to save it) or take a look at some of the pre-rendered and pre-saved videos and images [on my Instagram account](https://www.instagram.com/lorossi97/)

## Credits

This project is distributed under Attribution 4.0 International (CC BY 4.0) license.
