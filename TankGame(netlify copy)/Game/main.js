const Canvas = document.querySelector('.Game-Screen')

const Engine = new CanvasEngine(Canvas, { CanvasWorld, Vector2D, Velocity2D })

const { World, Vector, Velocity } = Engine

const Mouse = new MouseEvent(Canvas)
const Keyboard = new KeyboardEvent()

const { tank: Player, barrel: PlayerBarrel } = World.createTank({
    tankName: 'Player',
    tankColor: 'rgb(80, 120, 250)', barrelColor: 'rgb(70, 100, 200)',
    offsetX: 20, offsetY: 300,
    Mouse: Mouse, Keyboard: Keyboard
})

const { tank: Bot, barrel: BotBarrel } = World.createTank({
    tankName: 'Bot',
    tankColor: 'rgb(250, 100, 80)', barrelColor: 'rgb(200, 80, 70)',
    offsetX: 1080-140,
    offsetY: 360-70,
    maxShootCount: 100
})

const defaultBulletVelocityRate = 300

// const Music = new Tone.Player(`${location.origin}/wii_tanks.mp3`).toDestination()
let muteSoundEffects = true

Engine.Initialize(async () => {
    let pressedKeys = []

    World.createObstacle({ width: 100, height: 100, offsetX: 250, offsetY: 150 })
    World.createObstacle({ width: 100, height: 100, offsetX: 250, offsetY: 450 })
    World.createObstacle({ width: 100, height: 400, offsetX: 550, offsetY: 150 })

    // soundEffect('wii_tanks')

    // animation renderer
    Engine.Render(props => {
        if(Player.Properties.isMouseConnected && Player.Properties.isKeyboardConnected) {
            Player.Controller.keyboard.listener((pressed=[]) => pressedKeys = pressed)
            Player.Controller.mouse.listener(playerMouseEvents)

            for(let index = 0, length = pressedKeys.length; index < length; index++) {
                let key = pressedKeys[index]
                
                let [ centerX, centerY ] = Vector.getCenter(Player.vector)
                let angle = Vector.toDegree(math.atan2(Player.clientY - centerY-5, Player.clientX - centerX-5))
                
                // reverse the angle because the y-axis is flipped
                Velocity.setRotation(PlayerBarrel, 360 - angle, [ centerX, centerY ])

                let quadrant = Vector.getQuadrantByRotation(Player.rotation)

                switch(key) {
                    case 'w': {
                        
                        // check sides
                        if(quadrant === 1 || quadrant === 4) {
                            Velocity.rotate(Player, Engine.fps.delta * 200, Vector.getCenter(Player.vector))    

                            // then re-check to re-position the tank to make sure it's not out of bounds
                            quadrant = Vector.getQuadrantByRotation(Player.rotation)
                            if(quadrant === 2 || quadrant === 3) {
                                Velocity.rotate(Player, Player.rotation - 90, Vector.getCenter(Player.vector))
                            }
                        } else {
                            Velocity.rotate(Player, Engine.fps.delta * -200, Vector.getCenter(Player.vector))    

                            // then re-check to re-position the tank to make sure it's not out of bounds
                            quadrant = Vector.getQuadrantByRotation(Player.rotation)
                            if(quadrant === 1 || quadrant === 4) {
                                Velocity.rotate(Player, 90 - Player.rotation, Vector.getCenter(Player.vector))
                            }
                        }

                        // finish this
                        if(!World.isOutOfBounds(Player, World.getCanvasSize(Canvas), { offsetX: 0, offsetY: Engine.fps.delta * -200 }).collided) {
                            Velocity.move(Player, 0, Engine.fps.delta * -200)
                            soundEffect('moving_tank')
                        }                  
                        
                        break
                    } case 'a': {

                        // check sides
                        if(quadrant === 1 || quadrant === 2) {
                            Velocity.rotate(Player, Engine.fps.delta * -200, Vector.getCenter(Player.vector))    

                            // then re-check to re-position the tank to make sure it's not out of bounds
                            quadrant = Vector.getQuadrantByRotation(Player.rotation)
                            if(quadrant === 3 || quadrant === 4) {
                                Velocity.rotate(Player, Player.rotation - 180, Vector.getCenter(Player.vector))
                            }
                        } else {
                            Velocity.rotate(Player, Engine.fps.delta * 200, Vector.getCenter(Player.vector))    

                            // then re-check to re-position the tank to make sure it's not out of bounds
                            quadrant = Vector.getQuadrantByRotation(Player.rotation)
                            if(quadrant === 1 || quadrant === 2) {
                                Velocity.rotate(Player, 180 - Player.rotation, Vector.getCenter(Player.vector))
                            }
                        }

                        if(!World.isOutOfBounds(Player, World.getCanvasSize(Canvas), { offsetX: Engine.fps.delta * -200, offsetY: 0 }).collided) {
                            Velocity.move(Player, Engine.fps.delta * -200, 0)
                            soundEffect('moving_tank')
                        }
                        
                        break
                    } case 's': {
                        
                        // check sides
                        if(quadrant === 1 || quadrant === 4) {
                            Velocity.rotate(Player, Engine.fps.delta * -200, Vector.getCenter(Player.vector))    

                            // then re-check to re-position the tank to make sure it's not out of bounds
                            quadrant = Vector.getQuadrantByRotation(Player.rotation)
                            if(quadrant === 2 || quadrant === 3) {
                                Velocity.rotate(Player, Player.rotation - 270, Vector.getCenter(Player.vector))
                            }
                        } else {
                            Velocity.rotate(Player, Engine.fps.delta * 200, Vector.getCenter(Player.vector))    

                            // then re-check to re-position the tank to make sure it's not out of bounds
                            quadrant = Vector.getQuadrantByRotation(Player.rotation)
                            if(quadrant === 1 || quadrant === 4) {
                                Velocity.rotate(Player, 270 - Player.rotation, Vector.getCenter(Player.vector))
                            }
                        }

                        if(!World.isOutOfBounds(Player, World.getCanvasSize(Canvas), { offsetX: 0, offsetY: Engine.fps.delta * 200 }).collided) {
                            Velocity.move(Player, 0, Engine.fps.delta * 200)
                            soundEffect('moving_tank')
                        }
                        
                        break
                    } case 'd': {
                        
                        // check sides
                        if(quadrant === 1 || quadrant === 2) {
                            Velocity.rotate(Player, Engine.fps.delta * 200, Vector.getCenter(Player.vector))    

                            // then re-check to re-position the tank to make sure it's not out of bounds
                            quadrant = Vector.getQuadrantByRotation(Player.rotation)
                            if(quadrant === 3 || quadrant === 4) {
                                Velocity.rotate(Player, Player.rotation - 360, Vector.getCenter(Player.vector))
                            }
                        } else {
                            Velocity.rotate(Player, Engine.fps.delta * -200, Vector.getCenter(Player.vector))    

                            // then re-check to re-position the tank to make sure it's not out of bounds
                            quadrant = Vector.getQuadrantByRotation(Player.rotation)
                            if(quadrant === 1 || quadrant === 2) {
                                Velocity.rotate(Player, 360 - Player.rotation, Vector.getCenter(Player.vector))
                            }
                        }

                        if(!World.isOutOfBounds(Player, World.getCanvasSize(Canvas), { offsetX: Engine.fps.delta * 200, offsetY: 0 }).collided) {
                            Velocity.move(Player, Engine.fps.delta * 200, 0)
                            soundEffect('moving_tank')
                        }
                        
                        break
                    }
                }
            }
        }

        // AI
        if(Player.Properties.isInTheWorld && Bot.Properties.isInTheWorld) {
            let [ pcx, pcy ] = Vector.getCenter(Player.vector)
            let [ bcx, bcy ] = Vector.getCenter(Bot.vector)

            let distance = Vector.getDistance([pcx, pcy], [bcx, bcy])
            
            let angle = Vector.toDegree(math.atan2(pcy - bcy, pcx - bcx))
    
            Velocity.setRotation(BotBarrel, 360 - angle, [ bcx, bcy ])
    
            if(distance < 490) {
                setTimeout(() => {
                    if(World.createBullet(Bot, BotBarrel)) soundEffect('slow_tank_shooting')
                }, 100)
            }
        }
        

        // move bullets
        animateBullets()
    })
    
    function animateBullets() {
        let bullets = World.bodiesList.filter(v => v.name.includes('@Bullet'))
        let tanks = World.bodiesList.filter(v => v.name.includes('@Tank '))

        for(let index = 0, length = bullets.length; index < length; index++) {
            let bullet = bullets[index]
            let parent = bullet.Properties.Bullet.parent.autoGet
            let kill

            let bulletVelocityRate = bullet.Properties.Bullet.speed

            let [ x, y ] = Vector.moveFromRotation(bulletVelocityRate * Engine.fps.delta, bullet.rotation)
            let { collided: outOfBounds, x: xCheck } = World.isOutOfBounds(bullet, World.getCanvasSize(Canvas), { offsetX: x, offsetY: y })

            // check for all tanks, bullets and obstacles
            for(let tIndex = 0, tLength = tanks.length; tIndex < tLength; tIndex++) {
                let tank = tanks[tIndex]

                if(Vector.collisionCheck(bullet.SATVector, tank.SATVector)) {
                    kill = tank
                    break
                }
            }

            for(let bIndex = 0, bLength = bullets.length; bIndex < bLength; bIndex++) {
                let iterBullet = bullets[bIndex]

                if(bullet.uuid !== iterBullet.uuid && Vector.collisionCheck(bullet.SATVector, iterBullet.SATVector)) {
                    kill = iterBullet
                    break
                }
            }

            // kill the tank and remove bullet
            if(kill) {
                let kName = kill.name.match(/@Bullet/g)?.[0]

                let bParent = parent ?? {}
                let kParent = kill?.Properties?.Bullet?.parent?.autoGet ?? {}

                // both bodies must be in the world
                if(!bullet?.Properties?.isInTheWorld || !kill?.Properties?.isInTheWorld) continue

                // check if bullet gets destroyed by another bullet
                if(bParent?.uuid !== kParent?.uuid) {
                    if(kName === '@Bullet' && kParent?.Properties?.isInTheWorld) {
                        kParent.Properties.Bullet.decrease()
                    }
                    
                    if(bParent?.Properties?.isInTheWorld) {
                        bParent.Properties.Bullet.decrease()

                        if(kName !== '@Bullet') soundEffect('tank_destroyed')
                    }
                } else {
                    // decrease twice to decrease the counter correctly because it kills two bullets
                    if(bParent?.Properties) {
                        bParent.Properties.Bullet.decrease()
                        bParent.Properties.Bullet.decrease()
                    }
                }

                World.remove(kill, bullet)

                continue
            }

            let hittingObstacle = Vector.hitBoxCollision(Vector.clone(bullet.vector), { offsetX: x, offsetY: y })
            
            // check if bullet spawns inside an obstacle
            if(hittingObstacle.now.collided) {
                let bParent = parent?.Properties ?? {}
                
                if(bParent.isInTheWorld) {
                    bParent.Bullet.decrease()
                }

                World.remove(bullet)

                continue
            }

            // check if the bullet is hitting an obstacle
            if(hittingObstacle.after.collided && !hittingObstacle.before.collided) {
                let side = hittingObstacle.before

                let bulletCenter = Vector.getCenter(bullet.vector)    
                let flipRotate = side.x ? 180 - bullet.rotation : 360 - bullet.rotation

                let [ x, y ] = Vector.moveFromRotation(bulletVelocityRate * Engine.fps.delta, flipRotate)
                
                // kill the bullet when the bounce is over the limit of bouncing
                if(++bullet.Properties.Bullet.bounceCount > 1) {
                    // check to see if the parent exists
                    if(parent?.Properties?.isInTheWorld) parent.Properties.Bullet.decrease()
                    World.remove(bullet)

                    continue
                }

                soundEffect('bounce')
                
                Velocity.setRotation(bullet, flipRotate, bulletCenter)
                Velocity.move(bullet, x*2, y*2)

                continue
            }

            // detect for borders, obsticles and tanks
            if(outOfBounds) {
                let bulletCenter = Vector.getCenter(bullet.vector)    
                let flipRotate = xCheck ? 180 - bullet.rotation : 360 - bullet.rotation

                let [ x, y ] = Vector.moveFromRotation(bulletVelocityRate * Engine.fps.delta, flipRotate)

                // kill the bullet when the bounce is over the limit of bouncing
                if(++bullet.Properties.Bullet.bounceCount > 1) {
                    // check to see if the parent exists
                    if(parent?.Properties?.isInTheWorld) parent.Properties.Bullet.decrease()
                    World.remove(bullet)

                    continue
                }

                soundEffect('bounce')

                Velocity.setRotation(bullet, flipRotate, bulletCenter)
                Velocity.move(bullet, x*2, y*2)

            } else {
                // move bullet
                Velocity.move(bullet, x, y)
            }
        }

    }
    
    function playerMouseEvents(type, event) {
        if(type === 'move') {
            let { clientX, clientY } = event
            let [ centerX, centerY ] = Vector.getCenter(Player.vector)

            // Getting the real mouse position from the canvas because it gets the window pos instead of the real canvas pos
            let { left: canvasLeft, top: canvasTop } = Canvas.getBoundingClientRect()

            clientX -= canvasLeft
            clientY -= canvasTop

            Player.clientX = clientX
            Player.clientY = clientY
            
            let angle = Vector.toDegree(math.atan2(clientY - centerY-5, clientX - centerX-5))

            Velocity.setRotation(PlayerBarrel, 360 - angle, [ centerX, centerY ])
        } else if(type === 'down') {
            let createBullet = World.createBullet(Player, PlayerBarrel)

            if(createBullet) soundEffect('blue_tank_shooting')
        }
    }

    console.clear()
    console.log('%cGame Running...', 'color: rgb(50, 250, 100);')
}, { width: 1080, height: 720 })

async function soundEffect(type) {    
    if(muteSoundEffects) return void 0

    switch(type) {
        case 'blue_tank_shooting' : {
            let sound = new Tone.Player(`${location.origin}/blue_tank_shooting.wav`).toDestination()
            await Tone.loaded()
            
            sound.volume.value = -10

            sound.start()
            break
        } case 'slow_tank_shooting' : {
            let sound = new Tone.Player(`${location.origin}/slow_tank_shooting.wav`).toDestination()
            await Tone.loaded()
            
            sound.volume.value = -10

            sound.start()
            break
        } case 'moving_tank' : {
            let sound = new Tone.Player(`${location.origin}/moving_tank.wav`).toDestination()
            await Tone.loaded()

            sound.volume.value = -30

            sound.start()
            break
        } case 'wii_tanks' : {
            let sound = new Tone.Player(`${location.origin}/wii_tanks.mp3`).toDestination()
            await Tone.loaded()

            sound.volume.value = -10

            sound.start()
            break
        } case 'bounce' : {
            let sound = new Tone.Player(`${location.origin}/bounce.wav`).toDestination()
            await Tone.loaded()

            sound.volume.value = -10

            sound.start()
            break
        } case 'tank_destroyed': {
            let sound = new Tone.Player(`${location.origin}/tank_destroyed.wav`).toDestination()
            await Tone.loaded()

            sound.volume.value = -10

            sound.start()
            break
        }
    }
}