require('dotenv').config()

const cron = require('node-cron')
const axios = require('axios')
const fs = require('fs')
const { Webhook, MessageBuilder } = require('discord-webhook-node')
const hook = new Webhook(process.env.WEBHOOK)

fs.readFile('scan.json', (err, data) => {
  if (err) console.error(err)
  else {
    const jsonData = JSON.parse(data)

    cron.schedule(jsonData.cronSchedule, async () => {
      try {
        const { data } = await axios.get(
          'https://www.reddit.com/r/gamedeals.json'
        )
        const posts = data.data.children.map(child => {
          const { data: post } = child
          return {
            id: post.id,
            title: post.title,
            thumbnail: post.thumbnail,
            url: post.url,
            score: post.score,
            permalink: post.permalink,
            created_utc: post.created_utc
          }
        })

        const filteredPosts = posts.filter(
          post =>
            !jsonData.sentPosts.includes(post.id) &&
            (post.score >= jsonData.minScore ||
              (post.title.toLowerCase().indexOf('twitch') > -1 &&
                post.title.toLowerCase().indexOf('prime') > -1) ||
              (jsonData.freeRegex &&
                new RegExp(jsonData.freeRegex, 'gi').test(post.title)))
        )

        jsonData.sentPosts.push(...filteredPosts.map(post => post.id))

        filteredPosts.forEach(post => {
          const embed = new MessageBuilder()
            .setTitle(post.title)
            .setURL('https://www.reddit.com' + post.permalink)
            .setColor('#3266a9')
            .setDescription(
              post.title.toLowerCase().indexOf('twitch') > -1 &&
                post.title.toLowerCase().indexOf('prime') > -1
                ? 'Twitch Prime 🎮'
                : jsonData.freeRegex &&
                  new RegExp(jsonData.freeRegex, 'gi').test(post.title)
                ? 'Free game! 😁🎉'
                : 'Might be a good deal 🤔'
            )
            .setImage(
              post.thumbnail.startsWith('http')
                ? post.thumbnail
                : 'https://github.com/nunogois/discord-gamedeals/blob/main/images/empty_thumbnail.png?raw=true'
            )
            .setFooter(
              'discord-gamedeals',
              'https://github.com/nunogois/discord-gamedeals/blob/main/images/avatar.png?raw=true'
            )
            .setTimestamp()

          hook.send(embed).catch(err => console.error(err))
        })

        fs.writeFile('scan.json', JSON.stringify(jsonData, null, 2), err => {
          if (err) console.error(err)
        })
      } catch (err) {
        console.error(err)
      }
    })
  }
})
