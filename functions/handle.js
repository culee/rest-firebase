/* eslint-disable consistent-return */
const {db} = require('./initialize')
const batch = db.batch()
const nanoid = require('nanoid')

exports.getPlayers = async (req, res) => {
  let players = []

  try {
    const r = await db.collection('nba_salary').get()
    const promises = r.docs.map(async (doc) => {
      doc = await doc.data()
      players = [...players, doc]
    })
  
    Promise.all(promises)
    .then(() => res.status(200).json({status: "success", data: players}))
    .catch(e => res.status(404).json({status: "fail", data: {}}))
  }
  catch (e) { return res.status(404).json({status: "fail", data: {}}) }
}

exports.getPlayer = async (req, res) => {
  const {id} = req.params
  try {
    const r = await db.collection('nba_salary').doc(id).get()
    if (r.exists) {
      const doc = r.data()
      return res.status(200).json({status: "success", data: doc})
    }
    return res.status(404).json({status: "fail", data: {}})
  }
  catch (e) { return res.status(404).json({status: "fail", data: {}}) }
}

exports.addPlayer = async (req, res) => {
  const {Player, Team, Salary} = req.body

  if (!Player) { return res.status(404).json({status: "fail", data: {title: "Missing Player"}}) }
  if (!Team) { return res.status(404).json({status: "fail", data: {title: "Missing Team"}}) }
  if (!Salary) { return res.status(404).json({status: "fail", data: {title: "Missing Salary"}}) }

  const id = nanoid(10)
  const doc = { Player, Team, Salary, ID: id }

  try {
    await db.collection('nba_salary').doc(id).set(doc)
    return res.status(200).json({status: "success", data: doc})
  }
  catch (e) { res.status(404).json({status: "fail", data: {}}) }
}

exports.updatePlayer = async (req, res) => {
  const {id} = req.params
  const {Player, Team, Salary} = req.body

  if (!Player) { return res.status(404).json({ error: "Missing Player"}) }
  if (!Team) { return res.status(404).json({ error: "Missing Team"}) }
  if (!Salary) { return res.status(404).json({ error: "Missing Salary"}) }

  const doc = { Player, Team, Salary, ID: id }

  try {
    await db.collection('nba_salary').doc(id).set(doc)
    return res.status(200).json({status: "success", data: doc})
  }
  catch (e) { res.status(404).json({status: "fail", data: {}}) }
}

exports.deletePlayer = async (req, res) => {
  const {id} = req.params

  try {
    await db.collection('nba_salary').doc(id).delete()
    return res.status(200).json({status: "success", data: {}})
  }
  catch (e) { res.status(404).json({status: "fail", data: {}}) }
}