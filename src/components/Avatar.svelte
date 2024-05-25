<script>
    export let name = "";
    export let size = 30;

    import { getAvatarColor, getInitials } from './utils';

    $: color = getAvatarColor(name);
    $: initials = getInitials(name);
</script>

<style>
    .avatar {
        display: inline-block;
        border-radius: 50%;
        color: white;
        text-align: center;
        font-weight: bold;
        margin-left: 10px;
        line-height: var(--size);
        width: var(--size);
        height: var(--size);
        background-color: var(--color);
    }
</style>

<span class="avatar" style="--size: {size}px; --color: {color}">{initials}</span>
