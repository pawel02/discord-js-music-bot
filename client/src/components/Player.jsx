import { useSelector } from 'react-redux'
import { useSetPausedMutation, useGetPlayerQuery, useSkipMutation } from '../features/playerSlice'
import React from 'react'
import "./player.css"
import { useEffect, useState } from 'react'
import { GrPlayFill, GrPauseFill, GrRotateLeft } from "react-icons/gr"
import { MdSkipNext } from "react-icons/md"

const toSeconds = time => {
    const tArray = time.split(":")
    const inS = tArray.map((time, n) => {
        const s = +time * Math.pow(60, tArray.length - n - 1)
        return s
    })
    var timeInS = 0

    inS.forEach(time => {
        timeInS += time
    });

    return timeInS
}
const toString = (timeInS) => {
    const time = new Date((timeInS - 3600) * 1000 )
    return time.toLocaleTimeString();
}

export const Player = ({ serverId }) => {

    const { token } = useSelector(state => state.auth)
    const [setPaused] = useSetPausedMutation()
    const [skip, { isLoading: isSkiping }] = useSkipMutation()
    const {
        data: playerData,
    } = useGetPlayerQuery({ serverId, token })

    const [songProgress, setSongProgress] = useState()

    useEffect(() => {
        if (!playerData?.timestamp) return;
        const { current, end } = playerData?.timestamp
        const currentInS = toSeconds(current) + 1
        const endInS = toSeconds(end)
        setSongProgress({
            currentInS,
            endInS,
            progress: currentInS / endInS
        })
    }, [playerData?.timestamp])

    useEffect(() => {
        var timer
        if (songProgress) {
            timer = setTimeout(() => {
                setSongProgress((songProgress) => {
                    const { currentInS, endInS } = songProgress
                    const addToCurrent = playerData.isPaused ? 0 : 1
                    return {
                        currentInS: currentInS + addToCurrent,
                        endInS: endInS,
                        percent: Math.floor(currentInS / endInS * 100)
                    }
                })
            }, 1000)
        }
        return () => clearTimeout(timer)
    }, [songProgress, playerData?.isPaused])


    if (playerData?.isPaused !== undefined && playerData?.current && playerData?.isPlaying) {
        return (
            <div className='player'>
                <div className='thumbnail-container'>
                    <p className='title'>{playerData?.current.title}</p>
                    <img src={playerData?.current.thumbnail} />
                    <p className='author'>{playerData?.current.author}<br />
                    {songProgress?.currentInS && `${toString(songProgress.currentInS)} / ${toString(songProgress.endInS)}`}</p>
                    <div class="progress-bar" style={{width: `${songProgress?.percent}%`}}></div>
                </div>
                <div className='controlls'>
                    <button className='secondary'><GrRotateLeft /></button>
                    <button className='play-pause-button primary' onClick={() => setPaused({ serverId, state: !playerData?.isPaused })}>
                        {playerData?.isPaused ? <GrPlayFill /> : <GrPauseFill />}
                    </button>
                    <button onClick={() => skip({ serverId })} className='secondary'>{isSkiping ? "wait" : <MdSkipNext />}</button>
                </div>
            </div>
        )
    } else {
        return (
            <div></div>
        )
    }
}
